const express = require('express');
const {
    getUsers,
    toggleUserStatus,
    createDepartment,
    getDepartments,
    deleteDepartment,
    createSubject,
    getSubjects,
    deleteSubject,
    getMetrics,
    getAllCourses
} = require('../controllers/adminController');

const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(protect);

// Allow any authenticated user (Student/Faculty) to view Departments and Subjects
router.get('/departments', getDepartments);
router.get('/subjects', getSubjects);

// Restrict all subsequent routes to Admin only
router.use(authorize('admin'));

router.route('/users').get(getUsers);
router.route('/users/:userId/status').patch(toggleUserStatus);

router.route('/departments').post(createDepartment);
router.route('/departments/:id').delete(deleteDepartment);

router.route('/subjects').post(createSubject);
router.route('/subjects/:id').delete(deleteSubject);
router.route('/courses').get(getAllCourses);

router.route('/metrics').get(getMetrics);

module.exports = router;
