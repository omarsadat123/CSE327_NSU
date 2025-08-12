const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth-controller');

router.get('/login', authController.showLoginPage);
router.post('/login', authController.login);

router.get('/signup', authController.showSignupPage);
router.post('/signup', authController.handleSignup);

router.get('/verify-otp', authController.showOtpPage);
router.post('/verify-otp', authController.handleOtpVerification);

router.get('/logout', authController.logout);

module.exports = router;
