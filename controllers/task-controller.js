// controllers/taskController.js
const Task = require('../models/task-model');

/**
 * @file Defines the controller functions for handling task-related HTTP requests.
 */

/**
 * Renders the main page with a list of all tasks.
 * @async
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 */
// Function to render the main page with all tasks
exports.getTasks = async (req, res) => {
  try {
   const tasks = await Task.getAll();
   const participants = await Task.getParticipants(); // <- You'll create this method below
   res.render('index', { tasks, participants });

  } catch (err) {
    console.error('Error fetching tasks from the database:', err.message);
    // Send a user-friendly error message to the browser
    res.status(500).send('<h1>Server Error</h1><p>Could not load tasks. Please check the server console for details.</p>');
  }
};

/**
 * Creates a new task and redirects to the homepage.
 * @async
 * @function createTask
 * @param {Object} req - The HTTP request object containing task data in the body.
 * @param {Object} res - The HTTP response object used to send the response.
 * @param {string} req.body.task_name - The name of the task.
 * @param {string} req.body.task_status - The status of the task.
 * @param {string} [req.body.deadline] - The deadline for the task (optional).
 * @param {string} [req.body.description] - The description of the task (optional).
 * @param {string} [req.body.priority] - The priority of the task (optional).
 * @param {string} [req.body.category] - The category of the task (optional).
 * @param {number} req.body.project_id - The ID of the project the task belongs to.
 * @returns {Promise<void>} Redirects to the root URL on success or sends a 500 error on failure.
 * @throws {Error} If the database query fails, logs the error and returns a server error response.
 */
// Function to handle new task creation
exports.createTask = async (req, res) => {
  try {
    const { task_name, task_description, task_status, task_deadline, task_priority, task_category, project_id, assigned_uid } = req.body;
    const result= await Task.create(task_name, task_status, task_deadline ?? null, task_description, task_priority, task_category, project_id);

    // Get the inserted task ID
    const newTaskId = result.insertId;

    // Ensure assigned_uid is always treated as an array
    const assignedUsers = Array.isArray(assigned_uid) ? assigned_uid : [assigned_uid];

 // Assign each user
    for (const uid of assignedUsers) {
      await Task.assignUser(uid, newTaskId); // You should have assignUser function in your model
    }
    res.redirect('/');
  } catch (err) {
    console.error('Error creating a new task:', err.message);
    // Send a user-friendly error message to the browser
    res.status(500).send('<h1>Server Error</h1><p>Could not create a new task. Please check the server console for details.</p>');
  }
};
/**
 * Updates the status of a task based on the provided task ID and status.
 * @async
 * @function updateTaskStatus
 * @param {Object} req - The HTTP request object containing task_id and status in the body.
 * @param {Object} res - The HTTP response object used to send the response.
 * @param {number} req.body.task_id - The ID of the task to update.
 * @param {string} req.body.status - The new status to set for the task.
 * @returns {Promise<void>} Redirects to the root URL on success or sends a 500 error on failure.
 * @throws {Error} If the database query fails, logs the error and returns a server error response.
 */
// Function to update task status
exports.updateTaskStatus = async (req, res) => {
  try {
    const { task_id, status } = req.body;
    await Task.updateStatus(task_id, status);
    res.redirect('/');
  } catch (err) {
    console.error('Error updating task status:', err.message);
    res.status(500).send('<h1>Server Error</h1><p>Could not update task status.</p>');
  }
};

