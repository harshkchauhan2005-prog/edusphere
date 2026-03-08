const Quiz = require('../models/Quiz');
const Course = require('../models/Course');

// @desc    Create a quiz
// @route   POST /api/courses/:courseId/quizzes
// @access  Private/Faculty
exports.createQuiz = async (req, res, next) => {
    try {
        const { courseId } = req.params;
        const course = await Course.findById(courseId);

        if (!course) return res.status(404).json({ success: false, message: 'Course not found' });

        if (course.facultyId.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Not authorized to create quiz for this course' });
        }

        req.body.courseId = courseId;
        const quiz = await Quiz.create(req.body);

        res.status(201).json({ success: true, data: quiz });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Get quizzes for a course
// @route   GET /api/courses/:courseId/quizzes
// @access  Private (Enrolled/Faculty)
exports.getQuizzes = async (req, res, next) => {
    try {
        const { courseId } = req.params;
        const course = await Course.findById(courseId);

        if (!course) return res.status(404).json({ success: false, message: 'Course not found' });

        const isFaculty = course.facultyId.toString() === req.user.id;
        const isEnrolled = course.enrolledStudents.includes(req.user.id);

        if (!isFaculty && !isEnrolled && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        const quizzes = await Quiz.find({ courseId });

        res.status(200).json({ success: true, count: quizzes.length, data: quizzes });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Attempt/Submit a quiz
// @route   POST /api/courses/:courseId/quizzes/:quizId/attempt
// @access  Private/Student
exports.attemptQuiz = async (req, res, next) => {
    try {
        const { quizId } = req.params;
        const { answers } = req.body; // Array of { questionId, selectedOptionIndex, descriptiveText }

        const quiz = await Quiz.findById(quizId);
        if (!quiz) return res.status(404).json({ success: false, message: 'Quiz not found' });

        // Check if already attempted
        const alreadyAttempted = quiz.results.find(r => r.studentId.toString() === req.user.id);
        if (alreadyAttempted) {
            return res.status(400).json({ success: false, message: 'You have already attempted this quiz', score: alreadyAttempted.score });
        }

        // Evaluation Engine
        let score = 0;
        let requiresManualGrading = false;
        const studentAnswers = [];

        quiz.questions.forEach((question) => {
            const studentAnswer = answers.find(a => a.questionId.toString() === question._id.toString());

            const resultObj = {
                questionId: question._id,
                selectedOptionIndex: studentAnswer ? studentAnswer.selectedOptionIndex : null,
                descriptiveText: studentAnswer ? studentAnswer.descriptiveText : '',
                marksAwarded: 0
            };

            if (question.questionType === 'mcq') {
                if (studentAnswer && studentAnswer.selectedOptionIndex === question.correctOptionIndex) {
                    score += 1;
                    resultObj.marksAwarded = 1;
                }
            } else if (question.questionType === 'descriptive') {
                requiresManualGrading = true;
                // Score remains 0 until faculty grades it
            }

            studentAnswers.push(resultObj);
        });

        // Store result
        quiz.results.push({
            studentId: req.user.id,
            score,
            answers: studentAnswers,
            isGraded: !requiresManualGrading
        });

        await quiz.save();

        res.status(200).json({
            success: true,
            message: requiresManualGrading ? 'Quiz submitted. Descriptive answers pending manual grading.' : `You scored ${score} out of ${quiz.questions.length}`,
            score,
            isGraded: !requiresManualGrading
        });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Grade a student's quiz attempt (Descriptive answers)
// @route   PUT /api/courses/:courseId/quizzes/:quizId/results/:resultId/grade
// @access  Private/Faculty
exports.gradeQuiz = async (req, res, next) => {
    try {
        const { courseId, quizId, resultId } = req.params;
        const { grades } = req.body; // Array of { questionId, marksAwarded }

        const course = await Course.findById(courseId);
        if (!course) return res.status(404).json({ success: false, message: 'Course not found' });

        if (course.facultyId.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Not authorized to grade this quiz' });
        }

        const quiz = await Quiz.findById(quizId);
        if (!quiz) return res.status(404).json({ success: false, message: 'Quiz not found' });

        const result = quiz.results.id(resultId);
        if (!result) return res.status(404).json({ success: false, message: 'Result not found' });

        // Update marks
        grades.forEach((gradeObj) => {
            const answer = result.answers.find(a => a.questionId.toString() === gradeObj.questionId.toString());
            if (answer) {
                // Remove generic marks to replace with new marks
                result.score -= answer.marksAwarded;

                answer.marksAwarded = gradeObj.marksAwarded;
                result.score += gradeObj.marksAwarded;
            }
        });

        result.isGraded = true;
        await quiz.save();

        res.status(200).json({ success: true, message: 'Quiz graded successfully', data: result });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};
