/**
 * @file Password reset controller for ProCollab
 * @module controllers/password-reset-controller
 * @description Manages password reset flow: page rendering, sending codes, verifying, and updating passwords
 */

const PasswordResetModel = require('../models/password-reset');
const bcrypt = require('bcryptjs');
const transporter = require('../configs/mailer');

/**
 * Shows the password reset page
 * @param {object} req - Express request
 * @param {object} res - Express response
 */
const getPage = (req, res) => {
  res.render('password-reset', { phase: null, message: null });
};

/**
 * Sends a verification code to the user's email
 * @param {object} req - Express request
 * @param {object} res - Express response
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
 * Checks if the entered code is correct
 * @param {object} req - Express request
 * @param {object} res - Express response
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
 * Updates the password if verification passed
 * @param {object} req - Express request
 * @param {object} res - Express response
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
