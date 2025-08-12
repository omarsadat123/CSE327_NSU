/**
 * @file Password reset routes for ProCollab.
 * @module routes/password-reset-routes
 * @description Defines password reset routes including sending a code, verifying the code, and setting a new password.
 */

const express = require('express');
const router = express.Router();
const passwordResetController = require('../controllers/password-reset-controller');

/**
 * GET - Render password reset page.
 *
 * @name GET/change-password
 * @function
 * @memberof module:routes/password-reset-routes
 * @param {string} path - '/change-password'
 * @param {Function} handler - Controller method to render the reset page.
 */
router.get('/change-password', passwordResetController.getPage);

/**
 * POST - Send verification code to email.
 *
 * @name POST/send-code
 * @function
 * @memberof module:routes/password-reset-routes
 * @param {string} path - '/send-code'
 * @param {Function} handler - Controller method to send verification email.
 */
router.post('/send-code', passwordResetController.sendCode);

/**
 * POST - Verify submitted code.
 *
 * @name POST/verify-code
 * @function
 * @memberof module:routes/password-reset-routes
 * @param {string} path - '/verify-code'
 * @param {Function} handler - Controller method to verify code.
 */
router.post('/verify-code', passwordResetController.verifyCode);

/**
 * POST - Set new password after verification.
 *
 * @name POST/set-new-password
 * @function
 * @memberof module:routes/password-reset-routes
 * @param {string} path - '/set-new-password'
 * @param {Function} handler - Controller method to set a new password.
 */
router.post('/set-new-password', passwordResetController.setPassword);

module.exports = router;
