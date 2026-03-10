const Course = require('../models/Course');
const Subject = require('../models/Subject');

// @desc    Create new course
// @route   POST /api/courses
// @access  Private/Faculty
exports.createCourse = async (req, res, next) => {
    try {
        req.body.facultyId = req.user.id;

        // Ensure subject exists
        if (req.body.subject) {
            const subject = await Subject.findById(req.body.subject);
            if (!subject) {
                return res.status(404).json({ success: false, message: 'Subject not found' });
            }
        }

        const course = await Course.create(req.body);

        res.status(201).json({
            success: true,
            data: course
        });
    } catch (err) {
        console.error(err.stack);
        res.status(400).json({ success: false, message: err.message, stack: err.stack });
    }
};

// @desc    Get a single course by MongoDB ID
// @route   GET /api/courses/:courseId
// @access  Private (any authenticated user)
exports.getCourseById = async (req, res, next) => {
    try {
        const course = await Course.findById(req.params.courseId)
            .populate('facultyId', 'name email')
            .populate('subject', 'name');

        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }

        res.status(200).json({ success: true, data: course });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Join a course via Course ID
// @route   POST /api/courses/join
// @access  Private/Student
exports.joinCourse = async (req, res, next) => {
    try {
        const { courseId } = req.body;

        if (!courseId) {
            return res.status(400).json({ success: false, message: 'Please provide a course ID' });
        }

        const course = await Course.findOne({ courseId });

        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }

        // Check if student is already enrolled
        if (course.enrolledStudents.includes(req.user.id)) {
            return res.status(400).json({ success: false, message: 'Already enrolled in this course' });
        }

        course.enrolledStudents.push(req.user.id);
        await course.save();

        res.status(200).json({
            success: true,
            data: course
        });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Get enrolled courses
// @route   GET /api/courses/enrolled
// @access  Private/Student
exports.getEnrolledCourses = async (req, res, next) => {
    try {
        const courses = await Course.find({ enrolledStudents: req.user.id }).populate('facultyId', 'name email').populate('subject', 'name');

        res.status(200).json({
            success: true,
            count: courses.length,
            data: courses
        });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Get managed courses
// @route   GET /api/courses/managed
// @access  Private/Faculty
exports.getManagedCourses = async (req, res, next) => {
    try {
        const courses = await Course.find({ facultyId: req.user.id }).populate('subject', 'name');

        res.status(200).json({
            success: true,
            count: courses.length,
            data: courses
        });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Get all courses (Admin)
// @route   GET /api/courses
// @access  Private/Admin
exports.getAllCourses = async (req, res, next) => {
    try {
        const courses = await Course.find().populate('facultyId', 'name email').populate('subject', 'name');

        res.status(200).json({
            success: true,
            count: courses.length,
            data: courses
        });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Get course analytics (Faculty/Admin)
// @route   GET /api/courses/:courseId/analytics
// @access  Private/Faculty, Admin
exports.getCourseAnalytics = async (req, res, next) => {
    try {
        const course = await Course.findById(req.params.courseId);
        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }

        // Only allow assigned faculty or admin
        if (req.user.role === 'faculty' && course.facultyId.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Not authorized to view analytics for this course' });
        }

        const Assignment = require('../models/Assignment');
        const Quiz = require('../models/Quiz');

        // 1. Assignment Metrics
        const assignments = await Assignment.find({ courseId: course._id });
        const assignmentMetrics = assignments.map(a => ({
            title: a.title,
            submissionRate: course.enrolledStudents.length > 0
                ? Math.round((a.submissions.length / course.enrolledStudents.length) * 100)
                : 0,
            averageGrade: a.submissions.filter(s => s.grade !== undefined).length > 0
                ? Math.round(a.submissions.reduce((acc, curr) => acc + (curr.grade || 0), 0) / a.submissions.filter(s => s.grade !== undefined).length)
                : 0
        }));

        // 2. Quiz Performance
        const quizzes = await Quiz.find({ courseId: course._id });
        const quizMetrics = quizzes.map(q => {
            const validResults = q.results.filter(r => r.isGraded);
            return {
                title: q.title,
                averageScore: validResults.length > 0
                    ? Math.round(validResults.reduce((acc, curr) => acc + curr.score, 0) / validResults.length)
                    : 0,
                participationRate: course.enrolledStudents.length > 0
                    ? Math.round((q.results.length / course.enrolledStudents.length) * 100)
                    : 0
            };
        });

        res.status(200).json({
            success: true,
            data: {
                totalStudents: course.enrolledStudents.length,
                assignmentMetrics,
                quizMetrics
            }
        });

    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Add announcement to a course
// @route   POST /api/courses/:courseId/announcements
// @access  Private/Faculty
exports.addAnnouncement = async (req, res, next) => {
    try {
        const course = await Course.findById(req.params.courseId);
        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }

        // Only allow assigned faculty or admin
        if (req.user.role === 'faculty' && course.facultyId.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Not authorized to post announcements for this course' });
        }

        const { title, content } = req.body;
        if (!title || !content) {
            return res.status(400).json({ success: false, message: 'Please provide title and content' });
        }

        course.announcements.unshift({ title, content });
        await course.save();

        res.status(201).json({
            success: true,
            data: course.announcements
        });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Delete announcement from a course
// @route   DELETE /api/courses/:courseId/announcements/:announcementId
// @access  Private/Faculty
exports.deleteAnnouncement = async (req, res, next) => {
    try {
        const course = await Course.findById(req.params.courseId);
        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }

        // Only allow assigned faculty or admin
        if (req.user.role === 'faculty' && course.facultyId.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Not authorized to delete announcements for this course' });
        }

        // Remove the announcement
        course.announcements = course.announcements.filter(
            (announcement) => announcement._id.toString() !== req.params.announcementId
        );

        await course.save();

        res.status(200).json({
            success: true,
            data: course.announcements
        });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Global search across courses, materials, quizzes
// @route   GET /api/courses/search?q=query
// @access  Private
exports.searchAll = async (req, res, next) => {
    try {
        const query = req.query.q;
        if (!query) {
            return res.status(200).json({ success: true, count: 0, data: [] });
        }

        const regex = new RegExp(query, 'i');
        const results = [];

        // Determine accessible courses based on role
        let courseFilter = {};
        if (req.user.role === 'student') {
            courseFilter = { enrolledStudents: req.user.id };
        } else if (req.user.role === 'faculty') {
            courseFilter = { facultyId: req.user.id };
        }

        // 1. Search Courses
        const courses = await Course.find({ ...courseFilter, courseName: regex }).select('courseName _id');
        courses.forEach(c => {
            results.push({
                _id: c._id,
                title: c.courseName,
                type: 'course',
                courseId: c._id,
                url: `/${req.user.role}/courses/${c._id}`
            });
        });

        // 2. Search Materials & Quizzes (needs course restriction)
        const accessibleCourses = await Course.find(courseFilter).select('_id');
        const courseIds = accessibleCourses.map(c => c._id);

        const Material = require('../models/Material');
        const Quiz = require('../models/Quiz');

        const [materials, quizzes] = await Promise.all([
            Material.find({ courseId: { $in: courseIds }, title: regex }).populate('courseId', 'courseName'),
            Quiz.find({ courseId: { $in: courseIds }, title: regex }).populate('courseId', 'courseName')
        ]);

        materials.forEach(m => {
            results.push({
                _id: m._id,
                title: m.title,
                type: 'material',
                courseName: m.courseId?.courseName,
                courseId: m.courseId?._id,
                url: `/${req.user.role}/courses/${m.courseId?._id}`
            });
        });

        quizzes.forEach(q => {
            results.push({
                _id: q._id,
                title: q.title,
                type: 'quiz',
                courseName: q.courseId?.courseName,
                courseId: q.courseId?._id,
                url: `/${req.user.role}/courses/${q.courseId?._id}`
            });
        });

        res.status(200).json({
            success: true,
            count: results.length,
            data: results
        });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};
