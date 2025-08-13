
const collaboratorController = require('../controllers/collaborator-controller');
jest.mock('../models/collaborator', () => ({
  findUserByEmail: jest.fn(),
  isUserInProject: jest.fn(),
  addCollaboratorToProject: jest.fn(),
  getProjectNameById: jest.fn(),
  getUserNameById: jest.fn()
}));

const collaboratorModel = require('../models/collaborator');

jest.mock('nodemailer', () => ({
  createTransport: jest.fn().mockReturnValue({
    sendMail: jest.fn().mockResolvedValue(true)
  })
}));
const nodemailer = require('nodemailer');

describe('Collaborator Controller', () => {
  let req, res;

  beforeEach(() => {
    req = {
      session: {},
      params: {},
      body: {}
    };
    res = {
      render: jest.fn(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    };
    jest.clearAllMocks();
  });

  describe('showCollaboratorForm', () => {
    it('should render invite form', () => {
      req.params.pid = 10;
      collaboratorController.showCollaboratorForm(req, res);
      expect(res.render).toHaveBeenCalledWith('collaborator-invite', { pid: 10, message: null });
    });
  });

  describe('sendCollaboratorInvite', () => {
    it('should return 401 if not authenticated', async () => {
      await collaboratorController.sendCollaboratorInvite(req, res);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.send).toHaveBeenCalledWith('Unauthorized access.');
    });

    it('should show message if user not found', async () => {
      req.session.userId = 1;
      req.params.pid = 99;
      req.body.email = 'test@example.com';
      collaboratorModel.findUserByEmail.mockResolvedValue(null);

      await collaboratorController.sendCollaboratorInvite(req, res);

      expect(res.render).toHaveBeenCalledWith('collaborator-invite', {
        pid: 99,
        message: 'User with this email does not exist.'
      });
    });

    it('should show message if user already in project', async () => {
      req.session.userId = 1;
      req.params.pid = 99;
      req.body.email = 'test@example.com';
      collaboratorModel.findUserByEmail.mockResolvedValue({ uid: 2 });
      collaboratorModel.isUserInProject.mockResolvedValue(true);

      await collaboratorController.sendCollaboratorInvite(req, res);

      expect(res.render).toHaveBeenCalledWith('collaborator-invite', {
        pid: 99,
        message: 'User is already a member of the project.'
      });
    });

    it('should send email on success', async () => {
      req.session.userId = 1;
      req.params.pid = 99;
      req.body.email = 'test@example.com';
      collaboratorModel.findUserByEmail.mockResolvedValue({ uid: 2, name: 'John' });
      collaboratorModel.isUserInProject.mockResolvedValue(false);
      collaboratorModel.addCollaboratorToProject.mockResolvedValue();
      collaboratorModel.getProjectNameById.mockResolvedValue('Project X');
      collaboratorModel.getUserNameById.mockResolvedValue('Inviter');

      await collaboratorController.sendCollaboratorInvite(req, res);

      expect(nodemailer.createTransport().sendMail).toHaveBeenCalled();
      expect(res.render).toHaveBeenCalledWith('collaborator-invite', {
        pid: 99,
        message: 'Invitation sent successfully.'
      });
    });

    it('should show error message on exception', async () => {
      req.session.userId = 1;
      req.params.pid = 99;
      req.body.email = 'test@example.com';
      collaboratorModel.findUserByEmail.mockRejectedValue(new Error('DB fail'));

      await collaboratorController.sendCollaboratorInvite(req, res);

      expect(res.render).toHaveBeenCalledWith('collaborator-invite', {
        pid: 99,
        message: 'An error occurred. Please try again later.'
      });
    });
  });
});


