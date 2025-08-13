// tests/project-controller.test.js

const projectController = require('../controllers/project-controller');

// Explicit mock for the Project model
jest.mock('../models/project', () => ({
  create: jest.fn()
}));

const Project = require('../models/project');

describe('Project Controller', () => {
  let req;
  let res;

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
      session: {},
      body: {}
    };

    res = {
      redirect: jest.fn(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      render: jest.fn()
    };

    // Reset all mocks between tests
    jest.clearAllMocks();
  });

  describe('createProject', () => {
    it('should redirect to dashboard after successful creation', async () => {
      req.session.userId = 1;
      req.body = {
        name: 'New Project',
        visibility: 'public',
        description: 'Test description',
        status: 'active'
      };

      Project.create.mockResolvedValue();

      await projectController.createProject(req, res);

      expect(Project.create).toHaveBeenCalledWith({
        name: 'New Project',
        description: 'Test description',
        visibility: 'public',
        status: 'active',
        userId: 1
      });

      expect(res.redirect).toHaveBeenCalledWith('/dashboard');
    });

    it('should return 400 if name or visibility is missing', async () => {
      req.body = { name: '', visibility: '' };

      await projectController.createProject(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Name and visibility are required'
      });
      expect(Project.create).not.toHaveBeenCalled();
    });

    it('should render error page on creation failure', async () => {
      req.session.userId = 1;
      req.body = {
        name: 'Fail Project',
        visibility: 'private'
      };

      Project.create.mockRejectedValue(new Error('DB error'));

      await projectController.createProject(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.render).toHaveBeenCalledWith(
        'error',
        expect.objectContaining({
          message: 'Project creation failed. Please try again.'
        })
      );
    });
  });
});
