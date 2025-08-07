const Project = require('../models/project');
const { createProject } = require('../controllers/project-controller');

jest.mock('../models/project');

describe('createProject', () => {
  let req, res;

  beforeEach(() => {
    req = {
      session: { userId: 1 },
      body: {
        name: 'Test Project',
        description: 'This is a test project',
        visibility: 'public',
        status: 'active'
      }
    };

    res = {
      redirect: jest.fn(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a new project and redirect to /dashboard', async () => {
    Project.create.mockResolvedValue({ id: 1, ...req.body });

    await createProject(req, res);

    expect(Project.create).toHaveBeenCalledWith({
      ...req.body,
      userId: 1
    });

    expect(res.redirect).toHaveBeenCalledWith('/dashboard');
  });

  it('should return 500 if project creation fails', async () => {
    const error = new Error('DB error');
    Project.create.mockRejectedValue(error);

    await createProject(req, res);

    expect(Project.create).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith('Error creating project');
  });
});
