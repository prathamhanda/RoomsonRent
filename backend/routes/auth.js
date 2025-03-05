const express = require('express');
const { 
  register, 
  login, 
  logout, 
  getProfile, 
  forgotPassword, 
  resetPassword, 
  updatePassword, 
  verifyEmail,
  googleLogin
} = require('../controllers/auth');

const router = express.Router();

const { protect } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);
router.get('/profile', protect, getProfile);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:resettoken', resetPassword);
router.put('/update-password', protect, updatePassword);
router.get('/verify-email/:verificationtoken', verifyEmail);
router.post('/google-login', googleLogin);

module.exports = router; 