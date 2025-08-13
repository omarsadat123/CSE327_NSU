// Mock dependencies to prevent real DB or service calls
jest.mock('../models/auth', () => ({
  findUserByEmailAndPassword: jest.fn(),
  findUserByEmail: jest.fn(),
  createUserWithCredentials: jest.fn(),
}));

jest.mock('bcryptjs');
jest.mock('nodemailer');

const authController = require('../controllers/auth-controller');
const authModel = require('../models/auth');
const bcrypt = require('bcryptjs');

describe('Authentication Controller', () => {
  let req;
  let res;

  beforeEach(() => {
    // Reset request/response objects before each test
    req = { body: {}, session: {} };
    res = {
      render: jest.fn(),
      redirect: jest.fn(),
      clearCookie: jest.fn(),
    };
    jest.clearAllMocks();
  });

  // ---------------------------
  // Login Page Rendering
  // ---------------------------
  describe('showLoginPage', () => {
    it('renders login when no session exists', () => {
      authController.showLoginPage(req, res);
      expect(res.render).toHaveBeenCalledWith('login', { message: null });
    });

    it('redirects to dashboard when session exists', () => {
      req.session.userId = 1;
      authController.showLoginPage(req, res);
      expect(res.redirect).toHaveBeenCalledWith('/dashboard');
    });
  });

  // ---------------------------
  // Login Functionality
  // ---------------------------
  describe('login', () => {
    it('logs in and redirects when credentials are correct', async () => {
      authModel.findUserByEmailAndPassword.mockResolvedValue({
        uid: 1,
        name: 'Test User',
        email: 'test@example.com',
      });
      req.body = { email: 'test@example.com', password: '123456' };
      await authController.login(req, res);
      expect(req.session.userId).toBe(1);
      expect(res.redirect).toHaveBeenCalledWith('/dashboard');
    });

    it('renders login with error when credentials are invalid', async () => {
      authModel.findUserByEmailAndPassword.mockResolvedValue(null);
      req.body = { email: 'test@example.com', password: 'wrong' };
      await authController.login(req, res);
      expect(res.render).toHaveBeenCalledWith('login', {
        message: 'Invalid email or password.',
      });
    });

    it('renders login with error on exception', async () => {
      authModel.findUserByEmailAndPassword.mockRejectedValue(new Error('DB error'));
      req.body = { email: 'test@example.com', password: '123456' };
      await authController.login(req, res);
      expect(res.render).toHaveBeenCalledWith('login', {
        message: 'An error occurred. Please try again.',
      });
    });
  });

  // ---------------------------
  // Logout Functionality
  // ---------------------------
  describe('logout', () => {
    it('destroys session and redirects to login', () => {
      req.session.destroy = jest.fn((cb) => cb(null));
      authController.logout(req, res);
      expect(res.clearCookie).toHaveBeenCalledWith('connect.sid');
      expect(res.redirect).toHaveBeenCalledWith('/login');
    });

    it('redirects to dashboard if destroy fails', () => {
      req.session.destroy = jest.fn((cb) => cb(new Error('fail')));
      authController.logout(req, res);
      expect(res.redirect).toHaveBeenCalledWith('/dashboard');
    });
  });

  // ---------------------------
  // Signup Page Rendering
  // ---------------------------
  describe('showSignupPage', () => {
    it('renders signup page when no session', () => {
      authController.showSignupPage(req, res);
      expect(res.render).toHaveBeenCalledWith('signup', {
        errors: [],
        formData: {},
      });
    });

    it('redirects to dashboard when session exists', () => {
      req.session.userId = 1;
      authController.showSignupPage(req, res);
      expect(res.redirect).toHaveBeenCalledWith('/dashboard');
    });
  });

  // ---------------------------
  // OTP Page Rendering
  // ---------------------------
  describe('showOtpPage', () => {
    it('redirects to signup when no signupData found', () => {
      authController.showOtpPage(req, res);
      expect(res.redirect).toHaveBeenCalledWith('/signup');
    });

    it('renders OTP page when signupData exists', () => {
      req.session.signupData = { email: 'test@example.com' };
      authController.showOtpPage(req, res);
      expect(res.render).toHaveBeenCalledWith('verify-otp', {
        error: null,
        email: 'test@example.com',
      });
    });
  });

  // ---------------------------
  // OTP Verification
  // ---------------------------
  describe('handleOtpVerification', () => {
    it('redirects to signup if no session data', async () => {
      await authController.handleOtpVerification(req, res);
      expect(res.redirect).toHaveBeenCalledWith('/signup');
    });

    it('renders OTP page with error if OTP is invalid', async () => {
      req.session.signupData = { email: 'test@example.com' };
      req.session.otp = '123456';
      req.body = { otp: '000000' };
      await authController.handleOtpVerification(req, res);
      expect(res.render).toHaveBeenCalledWith('verify-otp', {
        error: 'Invalid OTP. Please try again.',
        email: 'test@example.com',
      });
    });

    it('creates user and redirects when OTP matches', async () => {
      req.session.signupData = {
        name: 'Test',
        email: 'test@example.com',
        password: 'pass',
      };
      req.session.otp = '123456';
      req.body = { otp: '123456' };
      bcrypt.hash.mockResolvedValue('hashedPass');
      authModel.createUserWithCredentials.mockResolvedValue({
        uid: 1,
        name: 'Test',
        email: 'test@example.com',
      });
      await authController.handleOtpVerification(req, res);
      expect(res.redirect).toHaveBeenCalledWith('/dashboard');
    });

    it('renders error if user creation fails', async () => {
      req.session.signupData = {
        name: 'Test',
        email: 'test@example.com',
        password: 'pass',
      };
      req.session.otp = '123456';
      req.body = { otp: '123456' };
      bcrypt.hash.mockResolvedValue('hashedPass');
      authModel.createUserWithCredentials.mockRejectedValue(new Error('fail'));
      await authController.handleOtpVerification(req, res);
      expect(res.render).toHaveBeenCalledWith('verify-otp', {
        error: 'Failed to create account. Please signup again.',
        email: 'test@example.com',
      });
    });
  });
});
