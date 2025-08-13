/**
 * @file auth.controller.test.js
 * @description Unit tests for the Authentication Controller module.
 * These tests cover login, signup, OTP verification, and logout functionalities.
 * All external dependencies (database, bcrypt, nodemailer) are mocked to avoid side effects.
 * @module tests/auth.controller.test
 */

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

  /**
   * Reset mock request and response before each test.
   */
  beforeEach(() => {
    req = { body: {}, session: {} };
    res = { render: jest.fn(), redirect: jest.fn(), clearCookie: jest.fn() };
    jest.clearAllMocks();
  });

  /**
   * @test
   * @description Unit tests for showing the login page.
   */
  describe('showLoginPage', () => {
    it('should render login page when no user session exists', () => {
      authController.showLoginPage(req, res);
      expect(res.render).toHaveBeenCalledWith('login', { message: null });
    });

    it('should redirect to dashboard when user session exists', () => {
      req.session.userId = 1;
      authController.showLoginPage(req, res);
      expect(res.redirect).toHaveBeenCalledWith('/dashboard');
    });
  });

  /**
   * @test
   * @description Unit tests for login functionality.
   */
  describe('login', () => {
    it('should login successfully and redirect when credentials are valid', async () => {
      authModel.findUserByEmailAndPassword.mockResolvedValue({
        uid: 1, name: 'Test User', email: 'test@example.com',
      });
      req.body = { email: 'test@example.com', password: '123456' };

      await authController.login(req, res);
      expect(req.session.userId).toBe(1);
      expect(res.redirect).toHaveBeenCalledWith('/dashboard');
    });

    it('should render login page with error when credentials are invalid', async () => {
      authModel.findUserByEmailAndPassword.mockResolvedValue(null);
      req.body = { email: 'test@example.com', password: 'wrong' };

      await authController.login(req, res);
      expect(res.render).toHaveBeenCalledWith('login', { message: 'Invalid email or password.' });
    });

    it('should render login page with error on exception', async () => {
      authModel.findUserByEmailAndPassword.mockRejectedValue(new Error('DB error'));
      req.body = { email: 'test@example.com', password: '123456' };

      await authController.login(req, res);
      expect(res.render).toHaveBeenCalledWith('login', { message: 'An error occurred. Please try again.' });
    });
  });

  /**
   * @test
   * @description Unit tests for logout functionality.
   */
  describe('logout', () => {
    it('should destroy session and redirect to login', () => {
      req.session.destroy = jest.fn(cb => cb(null));
      authController.logout(req, res);
      expect(res.clearCookie).toHaveBeenCalledWith('connect.sid');
      expect(res.redirect).toHaveBeenCalledWith('/login');
    });

    it('should redirect to dashboard if session destroy fails', () => {
      req.session.destroy = jest.fn(cb => cb(new Error('fail')));
      authController.logout(req, res);
      expect(res.redirect).toHaveBeenCalledWith('/dashboard');
    });
  });

  /**
   * @test
   * @description Unit tests for signup page rendering.
   */
  describe('showSignupPage', () => {
    it('should render signup page when no session exists', () => {
      authController.showSignupPage(req, res);
      expect(res.render).toHaveBeenCalledWith('signup', { errors: [], formData: {} });
    });

    it('should redirect to dashboard when user is logged in', () => {
      req.session.userId = 1;
      authController.showSignupPage(req, res);
      expect(res.redirect).toHaveBeenCalledWith('/dashboard');
    });
  });

  /**
   * @test
   * @description Unit tests for OTP page rendering.
   */
  describe('showOtpPage', () => {
    it('should redirect to signup if no signup data exists in session', () => {
      authController.showOtpPage(req, res);
      expect(res.redirect).toHaveBeenCalledWith('/signup');
    });

    it('should render verify-otp page when signup data exists', () => {
      req.session.signupData = { email: 'test@example.com' };
      authController.showOtpPage(req, res);
      expect(res.render).toHaveBeenCalledWith('verify-otp', { error: null, email: 'test@example.com' });
    });
  });

  /**
   * @test
   * @description Unit tests for OTP verification process.
   */
  describe('handleOtpVerification', () => {
    it('should redirect to signup if session data is missing', async () => {
      await authController.handleOtpVerification(req, res);
      expect(res.redirect).toHaveBeenCalledWith('/signup');
    });

    it('should render verify-otp page with error if OTP does not match', async () => {
      req.session.signupData = { email: 'test@example.com' };
      req.session.otp = '123456';
      req.body = { otp: '000000' };

      await authController.handleOtpVerification(req, res);
      expect(res.render).toHaveBeenCalledWith('verify-otp', {
        error: 'Invalid OTP. Please try again.',
        email: 'test@example.com',
      });
    });

    it('should create user and redirect when OTP matches', async () => {
      req.session.signupData = { name: 'Test', email: 'test@example.com', password: 'pass' };
      req.session.otp = '123456';
      req.body = { otp: '123456' };
      bcrypt.hash.mockResolvedValue('hashedPass');
      authModel.createUserWithCredentials.mockResolvedValue({
        uid: 1, name: 'Test', email: 'test@example.com',
      });

      await authController.handleOtpVerification(req, res);
      expect(res.redirect).toHaveBeenCalledWith('/dashboard');
    });

    it('should render verify-otp page with error if user creation fails', async () => {
      req.session.signupData = { name: 'Test', email: 'test@example.com', password: 'pass' };
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
