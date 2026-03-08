const express = require('express');
const {
    createCourse,
    getCourseById,
    joinCourse,
    getEnrolledCourses,
    getManagedCourses,
    getAllCourses,
    getCourseAnalytics,
    addAnnouncement,
    searchAll
} = require('../controllers/courseController');

const materialRouter = require('./materials');
const quizRouter = require('./quizzes');
const assignmentRouter = require('./assignments');

const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

// All course routes require authentication
router.use(protect);

// Re-route into other resource routers
router.use('/:courseId/materials', materialRouter);
router.use('/:courseId/quizzes', quizRouter);
router.use('/:courseId/assignments', assignmentRouter);

// Global Search
router.get('/search', searchAll);

// Course CRUD
router.post('/', authorize('faculty'), createCourse);
router.post('/join', authorize('student'), joinCourse);
router.get('/enrolled', authorize('student'), getEnrolledCourses);
router.get('/managed', authorize('faculty'), getManagedCourses);
router.get('/all', authorize('admin'), getAllCourses);

// Single course by MongoDB _id (must be AFTER named routes like /enrolled, /managed, /join)
router.get('/:courseId', getCourseById);

// Analytics
router.get('/:courseId/analytics', authorize('faculty', 'admin'), getCourseAnalytics);

// Announcements
router.post('/:courseId/announcements', authorize('faculty', 'admin'), addAnnouncement);

module.exports = router;
