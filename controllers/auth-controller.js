/**
 * Authentication Controller
 * Handles login, signup, OTP verification, and logout functionalities.
 * 
 * @module controllers/auth.controller
 */

const authModel = require('../models/auth');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

/**
 * Nodemailer transporter configuration for Gmail.
 * @constant
 */
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: '', // <-- Replace with your email
    pass: '', // <-- Replace with your app password
  },
});

/**
 * Generates a 6-digit OTP.
 * 
 * @returns {string} A 6-digit OTP as a string.
 */
function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

module.exports = {
  /**
   * Renders the login page.
   * 
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   */
  showLoginPage(req, res) {
    if (req.session.userId) return res.redirect('/dashboard');
    res.render('login', { message: null });
  },

  /**
   * Handles user login.
   * 
   * @async
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   */
  async login(req, res) {
    const { email, password } = req.body;
    try {
      const user = await authModel.findUserByEmailAndPassword(email, password);
      if (user) {
        req.session.userId = user.uid;
        req.session.user = { uid: user.uid, name: user.name, email: user.email };
        return res.redirect('/dashboard');
      }
      return res.render('login', { message: 'Invalid email or password.' });
    } catch (error) {
      console.error(error);
      return res.render('login', { message: 'An error occurred. Please try again.' });
    }
  },

  /**
   * Logs out the current user.
   * 
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   */
  logout(req, res) {
    req.session.destroy((err) => {
      if (err) {
        console.error(err);
        return res.redirect('/dashboard');
      }
      res.clearCookie('connect.sid');
      res.redirect('/login');
    });
  },

  /**
   * Renders the signup page.
   * 
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   */
  showSignupPage(req, res) {
    if (req.session.userId) return res.redirect('/dashboard');
    res.render('signup', { errors: [], formData: {} });
  },

  /**
   * Handles user signup and sends OTP.
   * 
   * @async
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   */
  async handleSignup(req, res) {
    if (req.session.userId) return res.redirect('/dashboard');

    const { name, email, password, confirmPassword } = req.body;
    const errors = [];
    const formData = { name, email };

    // Validate input
    if (!name || name.trim() === '') errors.push('Full Name is required.');
    else if (name.length > 100) errors.push('Full Name cannot exceed 100 characters.');

    if (!email || email.trim() === '') errors.push('Email is required.');
    else if (!/\S+@\S+\.\S+/.test(email)) errors.push('Invalid email format.');

    if (!password || password.length < 6) errors.push('Password must be at least 6 characters.');
    if (password !== confirmPassword) errors.push('Passwords do not match.');

    if (errors.length > 0) {
      return res.render('signup', { errors, formData });
    }

    try {
      const existingUser = await authModel.findUserByEmail(email);
      if (existingUser) {
        errors.push('Email already in use.');
        return res.render('signup', { errors, formData });
      }

      const otp = generateOtp();
      req.session.signupData = { name, email, password };
      req.session.otp = otp;

      await transporter.sendMail({
        from: '"ProCollab" <your-email@gmail.com>',
        to: email,
        subject: 'Your ProCollab Signup OTP',
        text: `Your OTP for ProCollab signup is: ${otp}`,
      });

      return res.redirect('/verify-otp');
    } catch (error) {
      console.error(error);
      errors.push('An error occurred during signup. Please try again.');
      return res.render('signup', { errors, formData });
    }
  },

  /**
   * Displays the OTP verification page.
   * 
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   */
  showOtpPage(req, res) {
    if (!req.session.signupData) return res.redirect('/signup');
    res.render('verify-otp', { error: null, email: req.session.signupData.email });
  },

  /**
   * Handles OTP verification and user account creation.
   * 
   * @async
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   */
  async handleOtpVerification(req, res) {
    const { otp } = req.body;
    if (!req.session.signupData || !req.session.otp) return res.redirect('/signup');

    if (otp !== req.session.otp) {
      return res.render('verify-otp', {
        error: 'Invalid OTP. Please try again.',
        email: req.session.signupData.email,
      });
    }

    const { name, email, password } = req.session.signupData;

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await authModel.createUserWithCredentials(name, email, hashedPassword);

      delete req.session.signupData;
      delete req.session.otp;

      req.session.userId = newUser.uid;
      req.session.user = { uid: newUser.uid, name: newUser.name, email: newUser.email };

      return res.redirect('/dashboard');
    } catch (error) {
      console.error(error);
      return res.render('verify-otp', {
        error: 'Failed to create account. Please signup again.',
        email,
      });
    }
  },
};
