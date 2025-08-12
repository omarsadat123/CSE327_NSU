/**
 * @file Password reset controller for ProCollab.
 * @module controllers/password-reset-controller
 * @description Handles rendering the reset page, sending verification codes, verifying codes, and setting new passwords.
 */

const PasswordResetModel = require('../models/password-reset');
const bcrypt = require('bcryptjs');
const transporter = require('../configs/mailer');

/**
 * Renders the password reset page.
 *
 * @function getPage
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @returns {void}
 */
const getPage = (req, res) => {
  res.render('password-reset', { phase: null, message: null });
};

/**
 * Sends a 6-digit verification code to the user's email address.
 *
 * @async
 * @function sendCode
 * @param {import('express').Request} req - Express request object.
 * @param {Object} req.body - Request body data.
 * @param {string} req.body.email - User's email address.
 * @param {import('express').Response} res - Express response object.
 * @returns {Promise<void>}
 */
const sendCode = async (req, res) => {
  const { email } = req.body;

  try {
    const [results] = await PasswordResetModel.findUserByEmail(email);

    if (!results?.length) {
      return res.render('password-reset', {
        phase: 'email',
        message: 'Email not found'
      });
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = Date.now() + 10 * 60 * 1000; // 10 minutes

    req.session.reset = {
      uid: results[0].uid,
      email,
      code,
      expires,
      verified: false
    };

    await transporter.sendMail({
      to: email,
      subject: 'Your ProCollab Verification Code',
      text: `Your verification code is: ${code}`
    });

    res.render('password-reset', { phase: 'code', message: null });
  } catch (error) {
    console.error('Send code error:', error);
    res.render('password-reset', {
      phase: 'email',
      message: 'Failed to send email or invalid email'
    });
  }
};

/**
 * Verifies the entered code against the stored session data.
 *
 * @function verifyCode
 * @param {import('express').Request} req - Express request object.
 * @param {Object} req.body - Request body data.
 * @param {string} req.body.code - 6-digit verification code.
 * @param {import('express').Response} res - Express response object.
 * @returns {void}
 */
const verifyCode = (req, res) => {
  const { code } = req.body;
  const data = req.session.reset;

  if (!data || Date.now() > data.expires) {
    return res.render('password-reset', {
      phase: 'email',
      message: 'Session expired'
    });
  }

  if (code !== data.code) {
    return res.render('password-reset', {
      phase: 'code',
      message: 'Invalid code'
    });
  }

  req.session.reset.verified = true;
  res.render('password-reset', { phase: 'password', message: null });
};

/**
 * Updates the user's password if verification is complete.
 *
 * @async
 * @function setPassword
 * @param {import('express').Request} req - Express request object.
 * @param {Object} req.body - Request body data.
 * @param {string} req.body.password - New password.
 * @param {string} req.body.confirm - Confirm password.
 * @param {import('express').Response} res - Express response object.
 * @returns {Promise<void>}
 */
const setPassword = async (req, res) => {
  const { password, confirm } = req.body;
  const reset = req.session.reset;

  if (!reset?.verified) {
    return res.render('password-reset', {
      phase: 'email',
      message: 'Unauthorized access'
    });
  }

  if (password !== confirm) {
    return res.render('password-reset', {
      phase: 'password',
      message: 'Passwords do not match'
    });
  }

  try {
    const hashed = await bcrypt.hash(password, 12);
    await PasswordResetModel.updatePassword(reset.uid, hashed);

    req.session.destroy(() => {
      res.render('password-reset', {
        phase: 'success',
        message: 'Password updated successfully!'
      });
    });
  } catch (error) {
    console.error('Set password error:', error);
    res.render('password-reset', {
      phase: 'password',
      message: 'Failed to update password'
    });
  }
};

module.exports = {
  getPage,
  sendCode,
  verifyCode,
  setPassword
};
