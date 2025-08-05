// tests/task-controller.test.js

const request = require('supertest');
const app = require('../server'); // Import your app
const Task = require('../models/task-model'); // Import the model we want to mock

// Mock the entire task-model module
jest.mock('../models/task-model');

describe('Task Controller Tests', () => {

  // Clear all mocks before each test to ensure tests are isolated
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test suite for GET / (getTasks)
  describe('GET /', () => {
    it('should fetch all tasks and render the index page', async () => {
      // 1. Setup: Define our fake data
      const mockTasks = [
        { tid: 1, task_name: 'My First Test Task', status: 'Pending' },
        { tid: 2, task_name: 'Another Test Task', status: 'In Progress' }
      ];
      const mockParticipants = [{ uid: 1, name: 'Chayan' }];

      // 2. Mocking: Tell our fake model what to return when called
      Task.getAll.mockResolvedValue(mockTasks);
      Task.getParticipants.mockResolvedValue(mockParticipants);

      // 3. Action: Make a request to our app
      const response = await request(app).get('/');

      // 4. Assertion: Check if everything worked as expected
      expect(response.statusCode).toBe(200);
      expect(Task.getAll).toHaveBeenCalledTimes(1); // Was the model function called?
      expect(Task.getParticipants).toHaveBeenCalledTimes(1);
      expect(response.text).toContain('My First Test Task'); // Does the rendered HTML contain our fake data?
    });
  });

  // Test suite for POST / (createTask)
  describe('POST /', () => {
    it('should create a new task and redirect', async () => {
      // 1. Setup: Define the form data we are "sending"
      const taskData = {
        task_name: 'New Test Task',
        deadline: null,
        task_status: 'To Do',
        project_id: 1,
        // ... add other fields as needed
      };
      
      // 2. Mocking: Mock the create method. It should return a fake DB result.
      Task.create.mockResolvedValue({ insertId: 99 });
      Task.assignUser.mockResolvedValue({}); // Mock assignUser as well

      // 3. Action: Make a POST request
      const response = await request(app)
        .post('/')
        .send(taskData);

      // 4. Assertion: Check if the logic was correct
      expect(response.statusCode).toBe(302); // 302 is the status code for a redirect
      expect(response.headers.location).toBe('/'); // Check it redirects to the homepage
      
      // Check that Task.create was called with the correct arguments
      expect(Task.create).toHaveBeenCalledWith(
        taskData.task_name,
        taskData.task_status,
        null, // Deadline was null in our test data
        undefined, // Description was undefined
        undefined, // Priority was undefined
        undefined, // Category was undefined
        taskData.project_id
      );
      expect(Task.create).toHaveBeenCalledTimes(1);
    });
  });

});