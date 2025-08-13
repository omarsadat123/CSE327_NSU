
/**
 * Task Routes
 *
 * Defines all routes related to tasks in a project.
 * Includes authentication middleware to ensure only logged-in users can access.
 *
 * @module routes/tasks
 */

const express = require('express');
const router = express.Router();
const taskController = require('../controllers/task-controller');

/**
 * Middleware to check if a user is authenticated.
 *
 * @function isAuthenticated
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Callback to pass control to the next middleware.
 * @returns {void}
 *
 * Redirects to `/login` if the user is not logged in.
 */

const isAuthenticated = (req, res, next) => {
  if (req.session.userId) return next();
  res.redirect('/login');
};

/**
 * GET /:projectId/tasks
 * 
 * Displays a list of tasks for a specific project.
 *
 * @name GetTasks
 * @route {GET} /:projectId/tasks
 * @middleware {isAuthenticated} Ensures the user is logged in.
 * @param {string} projectId - The unique project identifier.
 */

// List tasks for a project
router.get('/:projectId/tasks', isAuthenticated, taskController.getTasks);


/**
 * POST /:projectId/tasks/create
 * 
 * Creates a new task for a specific project.
 *
 * @name CreateTask
 * @route {POST} /:projectId/tasks/create
 * @middleware {isAuthenticated} Ensures the user is logged in.
 * @param {string} projectId - The unique project identifier.
 */

// Create a new task
router.post('/:projectId/tasks/create', isAuthenticated, taskController.createTask);

/**
 * POST /:projectId/tasks/update-status
 * 
 * Updates the status of a specific task and redirects back to the task list.
 *
 * @name UpdateTaskStatus
 * @route {POST} /:projectId/tasks/update-status
 * @middleware {isAuthenticated} Ensures the user is logged in.
 * @param {string} projectId - The unique project identifier.
 */

// Update task status — Use projectId param to redirect properly
router.post('/:projectId/tasks/update-status', isAuthenticated, taskController.updateTaskStatus);

module.exports = router;
