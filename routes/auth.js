/**
 * @fileoverview Authentication routes for signup, OTP verification, login, and rendering related pages.
 */

const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/auth.controller');

/**
 * @route POST /signup
 * @description Handle user signup.
 * @name signup
 * @function
 * @memberof router
 * @param {express.Request} req - Express request object.
 * @param {express.Response} res - Express response object.
 */
router.post('/signup', AuthController.signup);

/**
 * @route POST /verifyOtp
 * @description Handle OTP verification for signup/login.
 * @name verifyOtp
 * @function
 * @memberof router
 * @param {express.Request} req - Express request object.
 * @param {express.Response} res - Express response object.
 */
router.post('/verifyOtp', AuthController.verifyOtp);

/**
 * @route POST /login
 * @description Handle user login.
 * @name login
 * @function
 * @memberof router
 * @param {express.Request} req - Express request object.
 * @param {express.Response} res - Express response object.
 */


/**
 * @route GET /signup
 * @description Render signup page. Redirects to dashboard if user is already logged in.
 * @name getSignupPage
 * @function
 * @memberof router
 * @param {express.Request} req - Express request object.
 * @param {express.Response} res - Express response object.
 */
router.get('/signup', (req, res) => {
    if (req.session.user) {
        return res.redirect('/dashboard');
    }
    res.render('signup');
});

/**
 * @route GET /verifyOtp
 * @description Render OTP verification page.
 * @name getVerifyOtpPage
 * @function
 * @memberof router
 * @param {express.Request} req - Express request object.
 * @param {express.Response} res - Express response object.
 * @param {string} [req.query.email] - Optional email query parameter to pre-fill in the form.
 */
router.get('/verifyOtp', (req, res) => {
    res.render('verifyOtp', { 
        email: req.query.email || '', 
        error: null, 
        success: null 
    });
});

/**
 * @route GET /login
 * @description Render login page.
 * @name getLoginPage
 * @function
 * @memberof router
 * @param {express.Request} req - Express request object.
 * @param {express.Response} res - Express response object.
 */

/**
 * @route GET /
 * @description Redirect root URL to signup page.
 * @name getRoot
 * @function
 * @memberof router
 * @param {express.Request} req - Express request object.
 * @param {express.Response} res - Express response object.
 */
router.get('/', (req, res) => {
    res.redirect('/signup');
});

module.exports = router;