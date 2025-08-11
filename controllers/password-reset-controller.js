const PasswordReset = require('../models/password-reset');
const bcrypt = require('bcryptjs');
const transporter = require('../configs/mailer');

exports.getPage = (req, res) => {
  res.render('password-reset', { phase: null, message: null });
};

exports.sendCode = async (req, res) => {
  const { email } = req.body;

  try {
    const [results] = await PasswordReset.findUserByEmail(email);
    if (!results || results.length === 0) {
      return res.render('password-reset', { phase: 'email', message: 'Email not found' });
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = Date.now() + 10 * 60 * 1000;

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
      text: `Your code: ${code}`
    });

    res.render('password-reset', { phase: 'code', message: null });
  } catch (err) {
    console.error('Send code error:', err);
    res.render('password-reset', { phase: 'email', message: 'Failed to send email or invalid email' });
  }
};

exports.verifyCode = (req, res) => {
  const { code } = req.body;
  const data = req.session.reset;

  if (!data || Date.now() > data.expires) {
    return res.render('password-reset', { phase: 'email', message: 'Session expired' });
  }

  if (code !== data.code) {
    return res.render('password-reset', { phase: 'code', message: 'Invalid code' });
  }

  req.session.reset.verified = true;
  res.render('password-reset', { phase: 'password', message: null });
};

exports.setPassword = async (req, res) => {
  const { password, confirm } = req.body;
  const reset = req.session.reset;

  if (!reset || !reset.verified) {
    return res.render('password-reset', { phase: 'email', message: 'Unauthorized access' });
  }

  if (password !== confirm) {
    return res.render('password-reset', { phase: 'password', message: 'Passwords do not match' });
  }

  try {
    const hashed = await bcrypt.hash(password, 12);
    await PasswordReset.updatePassword(reset.uid, hashed);
    req.session.destroy(() => {
      res.render('password-reset', { phase: 'success', message: 'Password updated successfully!' });
    });
  } catch (err) {
    console.error('Set password error:', err);
    res.render('password-reset', { phase: 'password', message: 'Failed to update password' });
  }
};
