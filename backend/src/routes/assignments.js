const express = require('express');
const { createAssignment, getAssignments, submitAssignment, gradeAssignment } = require('../controllers/assignmentController');
const { protect, authorize } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

const router = express.Router({ mergeParams: true });

router.use(protect);

router.post('/', authorize('faculty'), upload.single('file'), createAssignment);
router.get('/', getAssignments);
router.post('/:assignmentId/submit', authorize('student'), upload.single('file'), submitAssignment);
router.put('/:assignmentId/submissions/:studentId/grade', authorize('faculty', 'admin'), gradeAssignment);

module.exports = router;
