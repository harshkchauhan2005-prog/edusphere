const express = require('express');
const { createQuiz, getQuizzes, attemptQuiz, gradeQuiz } = require('../controllers/quizController');
const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router({ mergeParams: true });

router.use(protect);

router.post('/', authorize('faculty'), createQuiz);
router.get('/', getQuizzes);
router.post('/:quizId/attempt', authorize('student'), attemptQuiz);
router.put('/:quizId/results/:resultId/grade', authorize('faculty', 'admin'), gradeQuiz);

module.exports = router;
