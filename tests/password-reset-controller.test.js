// tests/password-reset-controller.test.js

const passwordResetController = require('../controllers/password-reset-controller');

// Mock dependencies explicitly
jest.mock('../models/password-reset', () => ({
  findUserByEmail: jest.fn(),
  updatePassword: jest.fn()
}));

jest.mock('bcryptjs', () => ({
  hash: jest.fn()
}));

jest.mock('../configs/mailer', () => ({
  sendMail: jest.fn()
}));

const PasswordReset = require('../models/password-reset');
const bcrypt = require('bcryptjs');
const transporter = require('../configs/mailer');

describe('Password Reset Controller', () => {
  let req;
  let res;

  const originalConsoleError = console.error;
  const originalConsoleLog = console.log;

  beforeAll(() => {
    console.error = jest.fn();
    console.log = jest.fn();
  });

  afterAll(() => {
    console.error = originalConsoleError;
    console.log = originalConsoleLog;
  });

  beforeEach(() => {
    req = {
      body: {},
      session: {},
      sessionDestroyCallback: null
    };

    res = {
      render: jest.fn(),
      status: jest.fn().mockReturnThis()
    };

    jest.clearAllMocks();
  });

  describe('getPage', () => {
    it('should render password reset page with null phase and message', () => {
      passwordResetController.getPage(req, res);
      expect(res.render).toHaveBeenCalledWith('password-reset', { phase: null, message: null });
    });
  });

  describe('sendCode', () => {
    it('should render email phase if user not found', async () => {
      req.body.email = 'test@example.com';
      PasswordReset.findUserByEmail.mockResolvedValue([[]]);

      await passwordResetController.sendCode(req, res);

      expect(res.render).toHaveBeenCalledWith('password-reset', {
        phase: 'email',
        message: 'Email not found'
      });
    });

    it('should send verification code email and render code phase', async () => {
      req.body.email = 'test@example.com';
      PasswordReset.findUserByEmail.mockResolvedValue([[{ uid: 1, email: 'test@example.com' }]]);
      transporter.sendMail.mockResolvedValue();

      await passwordResetController.sendCode(req, res);

      expect(req.session.reset).toMatchObject({
        uid: 1,
        email: 'test@example.com',
        verified: false
      });
      expect(transporter.sendMail).toHaveBeenCalledWith(expect.objectContaining({
        to: 'test@example.com',
        subject: 'Your ProCollab Verification Code',
        text: expect.any(String)
      }));
      expect(res.render).toHaveBeenCalledWith('password-reset', { phase: 'code', message: null });
    });

    it('should render error if sending email fails', async () => {
      req.body.email = 'test@example.com';
      PasswordReset.findUserByEmail.mockResolvedValue([[{ uid: 1, email: 'test@example.com' }]]);
      transporter.sendMail.mockRejectedValue(new Error('SMTP error'));

      await passwordResetController.sendCode(req, res);

      expect(res.render).toHaveBeenCalledWith('password-reset', {
        phase: 'email',
        message: 'Failed to send email or invalid email'
      });
    });
  });

  describe('verifyCode', () => {
    it('should render session expired if no data or expired', () => {
      req.body.code = '123456';
      req.session.reset = null;

      passwordResetController.verifyCode(req, res);
      expect(res.render).toHaveBeenCalledWith('password-reset', {
        phase: 'email',
        message: 'Session expired'
      });

      req.session.reset = { expires: Date.now() - 1 };
      passwordResetController.verifyCode(req, res);
      expect(res.render).toHaveBeenCalledWith('password-reset', {
        phase: 'email',
        message: 'Session expired'
      });
    });

    it('should render invalid code if mismatch', () => {
      req.body.code = '111111';
      req.session.reset = { code: '222222', expires: Date.now() + 5000 };

      passwordResetController.verifyCode(req, res);
      expect(res.render).toHaveBeenCalledWith('password-reset', {
        phase: 'code',
        message: 'Invalid code'
      });
    });

    it('should verify and render password phase if code matches', () => {
      req.body.code = '222222';
      req.session.reset = { code: '222222', expires: Date.now() + 5000, verified: false };

      passwordResetController.verifyCode(req, res);
      expect(req.session.reset.verified).toBe(true);
      expect(res.render).toHaveBeenCalledWith('password-reset', { phase: 'password', message: null });
    });
  });

  describe('setPassword', () => {
    it('should render unauthorized if no reset or not verified', async () => {
      req.body.password = 'pass123';
      req.body.confirm = 'pass123';

      req.session.reset = null;
      await passwordResetController.setPassword(req, res);
      expect(res.render).toHaveBeenCalledWith('password-reset', {
        phase: 'email',
        message: 'Unauthorized access'
      });

      req.session.reset = { verified: false };
      await passwordResetController.setPassword(req, res);
      expect(res.render).toHaveBeenCalledWith('password-reset', {
        phase: 'email',
        message: 'Unauthorized access'
      });
    });

    it('should render error if passwords do not match', async () => {
      req.body.password = 'pass123';
      req.body.confirm = 'pass321';
      req.session.reset = { verified: true };

      await passwordResetController.setPassword(req, res);
      expect(res.render).toHaveBeenCalledWith('password-reset', {
        phase: 'password',
        message: 'Passwords do not match'
      });
    });

    it('should hash password, update DB, destroy session, and render success', async () => {
      req.body.password = 'pass123';
      req.body.confirm = 'pass123';
      req.session.reset = { verified: true, uid: 5 };
      bcrypt.hash.mockResolvedValue('hashedpass');
      PasswordReset.updatePassword.mockResolvedValue();
      req.session.destroy = jest.fn((cb) => cb());

      await passwordResetController.setPassword(req, res);

      expect(bcrypt.hash).toHaveBeenCalledWith('pass123', 12);
      expect(PasswordReset.updatePassword).toHaveBeenCalledWith(5, 'hashedpass');
      expect(res.render).toHaveBeenCalledWith('password-reset', {
        phase: 'success',
        message: 'Password updated successfully!'
      });
    });

    it('should render error if updatePassword fails', async () => {
      req.body.password = 'pass123';
      req.body.confirm = 'pass123';
      req.session.reset = { verified: true, uid: 5 };
      bcrypt.hash.mockResolvedValue('hashedpass');
      PasswordReset.updatePassword.mockRejectedValue(new Error('DB Error'));

      await passwordResetController.setPassword(req, res);

      expect(res.render).toHaveBeenCalledWith('password-reset', {
        phase: 'password',
        message: 'Failed to update password'
      });
    });
  });
});
