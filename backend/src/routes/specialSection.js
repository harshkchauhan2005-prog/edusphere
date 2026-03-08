const express = require('express');
const { uploadResource, getResources } = require('../controllers/specialSectionController');
const { protect, authorize } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

const router = express.Router();

router.use(protect);
router.use(authorize('student'));

router.post('/', upload.single('file'), uploadResource);
router.get('/', getResources);

module.exports = router;
