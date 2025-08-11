const PasswordReset = require('../models/password-reset');
const bcrypt = require('bcryptjs');
const transporter = require('../configs/mailer');

exports.getPage = (req, res) => {
  res.render('password-reset', { phase: null, message: null });
};

exports.sendCode = (req, res) => {
  const { email } = req.body;

  PasswordReset.findUserByEmail(email, (err, results) => {
    if (err || results.length === 0) {
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

    transporter.sendMail({
      to: email,
      subject: 'Your ProCollab Verification Code',
      text: `Your code: ${code}`
    }, (err2) => {
      if (err2) {
        return res.render('password-reset', { phase: 'email', message: 'Failed to send email' });
      }
      res.render('password-reset', { phase: 'code', message: null });
    });
  });
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

exports.setPassword = (req, res) => {
  const { password, confirm } = req.body;
  const reset = req.session.reset;

  if (!reset || !reset.verified) {
    return res.render('password-reset', { phase: 'email', message: 'Unauthorized access' });
  }

  if (password !== confirm) {
    return res.render('password-reset', { phase: 'password', message: 'Passwords do not match' });
  }

  bcrypt.hash(password, 12, (err, hashed) => {
    if (err) {
      return res.render('password-reset', { phase: 'password', message: 'Hashing failed' });
    }

    PasswordReset.updatePassword(reset.uid, hashed, (err2) => {
      if (err2) {
        return res.render('password-reset', { phase: 'password', message: 'Failed to update password' });
      }

      req.session.destroy(() => {
        res.render('password-reset', { phase: 'success', message: 'Password updated successfully!' });
      });
    });
  });
};
