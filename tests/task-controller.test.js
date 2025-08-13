// tests/task-controller.test.js

// 1️⃣ Mock the Task model first so DB is never touched
jest.mock('../models/task-model', () => ({
  getByProjectId: jest.fn(),
  getParticipantsByProject: jest.fn(),
  getProjectNameById: jest.fn(),
  create: jest.fn(),
  assignUser: jest.fn(),
  updateStatus: jest.fn(),
}));

const taskController = require('../controllers/task-controller');
const Task = require('../models/task-model');

// 2️⃣ Suppress console output during tests
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

describe('Task Controller', () => {
  let req;
  let res;

  beforeEach(() => {
    req = { params: {}, body: {} };
    res = {
      render: jest.fn(),
      redirect: jest.fn(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    jest.clearAllMocks();
  });

  describe('getTasks', () => {
    it('should render tasks page with correct data', async () => {
      req.params.projectId = '1';
      Task.getByProjectId.mockResolvedValue([{ id: 1, name: 'Test Task' }]);
      Task.getParticipantsByProject.mockResolvedValue([{ id: 10, name: 'User1' }]);
      Task.getProjectNameById.mockResolvedValue('My Project');

      await taskController.getTasks(req, res);

      expect(Task.getByProjectId).toHaveBeenCalledWith('1');
      expect(Task.getParticipantsByProject).toHaveBeenCalledWith('1');
      expect(Task.getProjectNameById).toHaveBeenCalledWith('1');
      expect(res.render).toHaveBeenCalledWith('task-create', {
        tasks: [{ id: 1, name: 'Test Task' }],
        participants: [{ id: 10, name: 'User1' }],
        projectName: 'My Project',
        projectId: '1',
      });
    });

    it('should handle errors', async () => {
      req.params.projectId = '1';
      Task.getByProjectId.mockRejectedValue(new Error('DB error'));

      await taskController.getTasks(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith(
        '<h1>Server Error</h1><p>Could not load tasks.</p>'
      );
    });
  });

  describe('createTask', () => {
    it('should create a task and assign users', async () => {
      req.body = {
        task_name: 'New Task',
        task_description: 'Desc',
        task_status: 'open',
        task_deadline: '2025-08-13',
        task_priority: 'high',
        task_category: 'dev',
        projectId: '1',
        assigned_uid: ['2', '3'],
      };

      Task.create.mockResolvedValue({ insertId: 99 });
      Task.assignUser.mockResolvedValue();

      await taskController.createTask(req, res);

      expect(Task.create).toHaveBeenCalledWith(
        'New Task',
        'open',
        '2025-08-13',
        'Desc',
        'high',
        'dev',
        '1'
      );
      expect(Task.assignUser).toHaveBeenCalledWith('2', 99);
      expect(Task.assignUser).toHaveBeenCalledWith('3', 99);
      expect(res.redirect).toHaveBeenCalledWith('/projects/1/tasks');
    });

    it('should handle errors on create', async () => {
      Task.create.mockRejectedValue(new Error('DB error'));

      await taskController.createTask(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith(
        '<h1>Server Error</h1><p>Could not create a new task. Check server console for details.</p>'
      );
    });
  });

  describe('updateTaskStatus', () => {
    it('should update task status and redirect', async () => {
      req.params.projectId = '1';
      req.body = { task_id: '5', status: 'done' };
      Task.updateStatus.mockResolvedValue();

      await taskController.updateTaskStatus(req, res);

      expect(Task.updateStatus).toHaveBeenCalledWith('5', 'done');
      expect(res.redirect).toHaveBeenCalledWith('/projects/1/tasks');
    });

    it('should handle errors', async () => {
      Task.updateStatus.mockRejectedValue(new Error('DB error'));

      await taskController.updateTaskStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith(
        '<h1>Server Error</h1><p>Could not update task status.</p>'
      );
    });
  });
});
