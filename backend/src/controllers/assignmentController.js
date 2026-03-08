const Assignment = require('../models/Assignment');
const Course = require('../models/Course');

// @desc    Create an assignment
// @route   POST /api/courses/:courseId/assignments
// @access  Private/Faculty
exports.createAssignment = async (req, res, next) => {
    try {
        const { courseId } = req.params;
        const course = await Course.findById(courseId);

        if (!course) return res.status(404).json({ success: false, message: 'Course not found' });

        if (course.facultyId.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        req.body.courseId = courseId;

        if (req.file) {
            req.body.facultyAttachment = req.file.path;
        }

        const assignment = await Assignment.create(req.body);

        res.status(201).json({ success: true, data: assignment });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Get all assignments for a course
// @route   GET /api/courses/:courseId/assignments
// @access  Private
exports.getAssignments = async (req, res, next) => {
    try {
        const { courseId } = req.params;

        const course = await Course.findById(courseId);
        if (!course) return res.status(404).json({ success: false, message: 'Course not found' });

        const assignments = await Assignment.find({ courseId });

        res.status(200).json({
            success: true,
            count: assignments.length,
            data: assignments
        });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Submit an assignment
// @route   POST /api/courses/:courseId/assignments/:assignmentId/submit
// @access  Private/Student
exports.submitAssignment = async (req, res, next) => {
    try {
        const { assignmentId } = req.params;
        const assignment = await Assignment.findById(assignmentId);

        if (!assignment) return res.status(404).json({ success: false, message: 'Assignment not found' });

        // Deadline check
        if (Date.now() > new Date(assignment.deadline).getTime()) {
            return res.status(403).json({ success: false, message: 'Deadline has passed. Submissions are closed.' });
        }

        if (!req.file) {
            return res.status(400).json({ success: false, message: 'Please upload a submission file' });
        }

        // Check for existing submission
        const existingIndex = assignment.submissions.findIndex(sub => sub.studentId.toString() === req.user.id);

        if (existingIndex !== -1) {
            // Overwrite previous submission
            assignment.submissions[existingIndex].submissionFile = req.file.path;
            assignment.submissions[existingIndex].submittedAt = Date.now();
        } else {
            assignment.submissions.push({
                studentId: req.user.id,
                submissionFile: req.file.path
            });
        }

        await assignment.save();

        res.status(200).json({ success: true, message: 'Assignment submitted successfully' });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Grade an assignment submission
// @route   PUT /api/courses/:courseId/assignments/:assignmentId/submissions/:studentId/grade
// @access  Private/Faculty
exports.gradeAssignment = async (req, res, next) => {
    try {
        const { courseId, assignmentId, studentId } = req.params;
        const { grade, feedback } = req.body;

        const course = await Course.findById(courseId);
        if (!course) return res.status(404).json({ success: false, message: 'Course not found' });

        if (course.facultyId.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        const assignment = await Assignment.findById(assignmentId);
        if (!assignment) return res.status(404).json({ success: false, message: 'Assignment not found' });

        const submission = assignment.submissions.find(sub => sub.studentId.toString() === studentId);
        if (!submission) return res.status(404).json({ success: false, message: 'Submission not found for this student' });

        submission.grade = grade;
        submission.feedback = feedback;

        await assignment.save();

        res.status(200).json({ success: true, message: 'Assignment graded successfully', data: submission });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};
