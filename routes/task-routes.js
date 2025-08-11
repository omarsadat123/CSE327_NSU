const express = require('express');
const router = express.Router();
const taskController = require('../controllers/task-controller');

// Authentication middleware (can be extracted to a separate file)
const isAuthenticated = (req, res, next) => {
  if (req.session.userId) return next();
  res.redirect('/login');
};

// List tasks for a project
router.get('/:projectId/tasks', isAuthenticated, taskController.getTasks);

// Create a new task for a project
router.post('/:projectId/tasks/create', isAuthenticated, taskController.createTask);

// Update task status
router.post('/tasks/update-status', isAuthenticated, taskController.updateTaskStatus);

module.exports = router;
