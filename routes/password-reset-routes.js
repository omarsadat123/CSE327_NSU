/**
 * @file Password reset routes for ProCollab.
 * @module routes/password-reset-routes
 * @description Defines routes related to password reset functionality including requesting a reset, verifying code, and setting a new password.
 */

const express = require('express');
const router = express.Router();
const controller = require('../controllers/password-reset-controller');

/**
 * Route to render the password reset page.
 * @name GET /change-password
 * @function
 * @memberof module:routes/password-reset-routes
 * @param {string} path - '/change-password'
 * @param {Function} handler - Controller method to render the reset password page.
 */
router.get('/change-password', controller.getPage);

/**
 * Route to send a verification code to user's email.
 * @name POST /send-code
 * @function
 * @memberof module:routes/password-reset-routes
 * @param {string} path - '/send-code'
 * @param {Function} handler - Controller method to send the verification code email.   
 */
router.post('/send-code', controller.sendCode);

/**
 * Route to verify the 6-digit verification code.
 * @name POST /verify-code
 * @function
 * @memberof module:routes/password-reset-routes
 * @param {string} path - '/verify-code'
 * @param {Function} handler - Controller method to verify the submitted code.
 */
router.post('/verify-code', controller.verifyCode);

/**
 * Route to set a new password after code verification.
 * @name POST /set-new-password
 * @function
 * @memberof module:routes/password-reset-routes
 * @param {string} path - '/set-new-password'
 * @param {Function} handler - Controller method to update the user's password.
 */
router.post('/set-new-password', controller.setPassword);

module.exports = router;
