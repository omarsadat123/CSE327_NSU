/**
 * @file Password reset routes for ProCollab.
 * @module routes/password-reset-routes
 * @description Routes for sending verification codes, verifying them, and setting new passwords.
 */

const express = require('express');
const router = express.Router();
const passwordResetController = require('../controllers/password-reset-controller');

/**
 * Renders the change password page.
 *
 * @route GET /change-password
 */
router.get('/change-password', passwordResetController.getPage);

/**
 * Sends a verification code to the user's email.
 *
 * @route POST /send-code
 */
router.post('/send-code', passwordResetController.sendCode);

/**
 * Verifies the submitted code.
 *
 * @route POST /verify-code
 */
router.post('/verify-code', passwordResetController.verifyCode);

/**
 * Sets a new password after verification.
 *
 * @route POST /set-new-password
 */
router.post('/set-new-password', passwordResetController.setPassword);

module.exports = router;
