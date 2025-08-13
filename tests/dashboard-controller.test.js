// tests/dashboard-controller.test.js

const dashboardController = require('../controllers/dashboard-controller');

// Mock the Dashboard model explicitly
jest.mock('../models/dashboard', () => ({
  getUserById: jest.fn(),
  getActiveProjectCounts: jest.fn(),
  getPendingTasksCount: jest.fn(),
  getOwnedProjects: jest.fn(),
  getJoinedProjects: jest.fn(),
  getUpcomingTasks: jest.fn()
}));

const Dashboard = require('../models/dashboard');

describe('Dashboard Controller', () => {
  let req;
  let res;
  let next;

  // Suppress console.error and console.log during tests
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
      session: {}
    };

    res = {
      redirect: jest.fn(),
      render: jest.fn(),
      status: jest.fn().mockReturnThis()
    };

    next = jest.fn();

    // Reset all mocks between tests
    jest.clearAllMocks();
  });

  describe('ensureAuthenticated', () => {
    it('should redirect to /login if userId is missing', () => {
      dashboardController.ensureAuthenticated(req, res, next);
      expect(res.redirect).toHaveBeenCalledWith('/login');
      expect(next).not.toHaveBeenCalled();
    });

    it('should call next if userId exists', () => {
      req.session.userId = 123;
      dashboardController.ensureAuthenticated(req, res, next);
      expect(next).toHaveBeenCalled();
      expect(res.redirect).not.toHaveBeenCalled();
    });
  });

  describe('getDashboard', () => {
    it('should render dashboard with user data and counts', async () => {
      req.session.userId = 1;
      req.session.user = { id: 1, name: 'Test User' };

      // Mock dashboard model methods
      Dashboard.getUserById.mockResolvedValue({ id: 1, name: 'Test User' });
      Dashboard.getActiveProjectCounts.mockResolvedValue(5);
      Dashboard.getPendingTasksCount.mockResolvedValue(3);
      Dashboard.getOwnedProjects.mockResolvedValue([{ id: 1 }]);
      Dashboard.getJoinedProjects.mockResolvedValue([{ id: 2 }]);
      Dashboard.getUpcomingTasks.mockResolvedValue([{ id: 101 }]);

      await dashboardController.getDashboard(req, res);

      expect(res.render).toHaveBeenCalledWith('dashboard', expect.objectContaining({
        user: expect.any(Object),
        projectCounts: 5,
        pendingTasksCount: 3,
        ownedProjects: expect.any(Array),
        joinedProjects: expect.any(Array),
        upcomingTasks: expect.any(Array)
      }));
    });

    it('should render error page on exception', async () => {
      req.session.userId = 1;

      // Force one method to throw an error
      Dashboard.getActiveProjectCounts.mockRejectedValue(new Error('DB failure'));

      await dashboardController.getDashboard(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.render).toHaveBeenCalledWith('error', expect.objectContaining({
        message: 'Failed to load dashboard'
      }));
    });
  });
});
