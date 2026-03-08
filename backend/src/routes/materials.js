const express = require('express');
const { uploadMaterial, getMaterials } = require('../controllers/materialController');
const { protect, authorize } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

const router = express.Router({ mergeParams: true }); // Merge params to get courseId from parent router

router.use(protect);

router.post('/', authorize('faculty'), upload.single('file'), uploadMaterial);
router.get('/', getMaterials);

module.exports = router;
