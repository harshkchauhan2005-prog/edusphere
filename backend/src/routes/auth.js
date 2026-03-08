const express = require('express');
const { register, login, forgotPassword, resetPassword, verifyEmail, getMe, updateProfile, uploadProfilePhoto } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');
const { getDepartments } = require('../controllers/adminController');

const router = express.Router();

router.get('/departments', getDepartments);

router.post('/register', register);
router.post('/login', login);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resettoken', resetPassword);
router.put('/verifyemail/:verificationtoken', verifyEmail);

// Protected routes
router.get('/me', protect, getMe);
router.put('/updateprofile', protect, updateProfile);
router.put('/uploadphoto', protect, upload.single('photo'), uploadProfilePhoto);

module.exports = router;
