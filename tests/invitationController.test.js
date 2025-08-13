
const invitationController = require('../controllers/invitationController');

jest.mock('../models/invitation', () => ({
  getInvitationsByUserId: jest.fn(),
  acceptInvitation: jest.fn(),
  rejectInvitation: jest.fn()
}));

const Invitation = require('../models/invitation');

describe('Invitation Controller', () => {
  let req, res;

  beforeEach(() => {
    req = {
      session: {},
      params: {},
      body: {}
    };
    res = {
      redirect: jest.fn(),
      render: jest.fn(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    };
    jest.clearAllMocks();
  });

  describe('viewInvitations', () => {
    it('should redirect to login if not authenticated', async () => {
      await invitationController.viewInvitations(req, res);
      expect(res.redirect).toHaveBeenCalledWith('/login');
    });

    it('should render invitations if authenticated', async () => {
      req.session.userId = 1;
      req.session.user = { name: 'Test User' };
      Invitation.getInvitationsByUserId.mockResolvedValue([{ id: 1 }]);

      await invitationController.viewInvitations(req, res);

      expect(res.render).toHaveBeenCalledWith('invitations', {
        invitations: [{ id: 1 }],
        user: { name: 'Test User' }
      });
    });

    it('should send 500 on error', async () => {
      req.session.userId = 1;
      Invitation.getInvitationsByUserId.mockRejectedValue(new Error('DB fail'));

      await invitationController.viewInvitations(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith('Server error');
    });
  });

  describe('acceptInvitation', () => {
    it('should redirect to login if not authenticated', async () => {
      await invitationController.acceptInvitation(req, res);
      expect(res.redirect).toHaveBeenCalledWith('/login');
    });

    it('should call acceptInvitation and redirect if authenticated', async () => {
      req.session.userId = 1;
      req.params.pid = 101;

      await invitationController.acceptInvitation(req, res);

      expect(Invitation.acceptInvitation).toHaveBeenCalledWith(1, 101);
      expect(res.redirect).toHaveBeenCalledWith('/invitations');
    });
  });

  describe('rejectInvitation', () => {
    it('should redirect to login if not authenticated', async () => {
      await invitationController.rejectInvitation(req, res);
      expect(res.redirect).toHaveBeenCalledWith('/login');
    });

    it('should call rejectInvitation and redirect if authenticated', async () => {
      req.session.userId = 1;
      req.params.pid = 202;

      await invitationController.rejectInvitation(req, res);

      expect(Invitation.rejectInvitation).toHaveBeenCalledWith(1, 202);
      expect(res.redirect).toHaveBeenCalledWith('/invitations');
    });
  });
});

