/**
 * Authentication Routes
 * Handles routes for signup, OTP verification, and login.
 */

const express = require('express');
const router = express.Router();

const AuthController = require('../controllers/auth.controller');

/**
 * POST /signup
 * Creates a new user and sends OTP.
 */
router.post('/signup', AuthController.signup);

/**
 * POST /verifyOtp
 * Verifies the OTP for a newly signed-up user.
 */
router.post('/verifyOtp', AuthController.verifyOtp);

/**
 * POST /login
 * Authenticates an existing user.
 */
router.post('/login', AuthController.login);

/**
 * GET /signup
 * Renders the signup page or redirects if already logged in.
 */
router.get('/signup', (req, res) => {
    if (req.session.userId) {
        return res.redirect('/dashboard');
    }
    return res.render('signup');
});

/**
 * GET /verifyOtp
 * Renders the OTP verification page.
 */
router.get('/verifyOtp', (req, res) => {
    return res.render('verifyOtp', { uid: req.query.uid });
});

/**
 * GET /
 * Redirects root path to signup page.
 */
router.get('/', (req, res) => {
    return res.redirect('/signup');
});

module.exports = router;
