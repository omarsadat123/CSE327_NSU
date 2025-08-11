// tests/task-controller.test.js
const request = require('supertest');
const app = require('../app');
const Task = require('../models/task-model');

jest.mock('../models/task-model');

Task.getByProjectId = jest.fn();
Task.getParticipantsByProject = jest.fn();
Task.getProjectNameById = jest.fn();
Task.create = jest.fn();
Task.assignUser = jest.fn();

describe('Task Controller Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /projects/:projectId', () => {
    it('should fetch all tasks and render the task-create page', async () => {
      const projectId = '1';
      const mockTasks = [
        {
          tid: 1,
          task_name: 'My First Test Task',
          status: 'Pending',
          deadline: null,
          task_description: 'Test description',
          priority: 'Medium',
          category: 'Development',
          project_name: 'Test Project',
          pid: 1,
          assigned_user_names: 'Chayan',
        },
        {
          tid: 2,
          task_name: 'Another Test Task',
          status: 'In Progress',
          deadline: '2025-08-15',
          task_description: null,
          priority: 'High',
          category: 'Design',
          project_name: 'Test Project',
          pid: 1,
          assigned_user_names: null,
        },
      ];
      const mockParticipants = [{ uid: 1, name: 'Chayan' }];
      const mockProjectName = 'Test Project';

      Task.getByProjectId.mockResolvedValue(mockTasks);
      Task.getParticipantsByProject.mockResolvedValue(mockParticipants);
      Task.getProjectNameById.mockResolvedValue(mockProjectName);

      const response = await request(app).get(`/projects/${projectId}`);

      expect(response.statusCode).toBe(200);
      expect(Task.getByProjectId).toHaveBeenCalledWith(projectId);
      expect(Task.getByProjectId).toHaveBeenCalledTimes(1);
      expect(Task.getParticipantsByProject).toHaveBeenCalledWith(projectId);
      expect(Task.getParticipantsByProject).toHaveBeenCalledTimes(1);
      expect(Task.getProjectNameById).toHaveBeenCalledWith(projectId);
      expect(Task.getProjectNameById).toHaveBeenCalledTimes(1);
      expect(response.text).toContain('My First Test Task');
      expect(response.text).toContain('Test Project');
      expect(response.text).toContain('Chayan');
    });
  });

  describe('POST /', () => {
    it('should create a new task and redirect to project page', async () => {
      const taskData = {
        task_name: 'New Test Task',
        task_description: 'Test description',
        task_status: 'To Do',
        task_deadline: '', // Changed to empty string to match form behavior
        task_priority: 'Medium',
        task_category: 'Development',
        project_id: '1',
        'assigned_uid[]': ['1'],
      };

      Task.create.mockResolvedValue({ insertId: 99 });
      Task.assignUser.mockResolvedValue({});

      const response = await request(app)
        .post('/')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send(taskData);

      expect(response.statusCode).toBe(302);
      expect(response.headers.location).toBe('/projects/1');

      expect(Task.create).toHaveBeenCalledWith(
        taskData.task_name,
        taskData.task_status,
        taskData.task_deadline, // ""
        taskData.task_description,
        taskData.task_priority,
        taskData.task_category,
        taskData.project_id
      );
      expect(Task.create).toHaveBeenCalledTimes(1);
      expect(Task.assignUser).toHaveBeenCalledWith('1', 99);
      expect(Task.assignUser).toHaveBeenCalledTimes(1);
    });
  });
});