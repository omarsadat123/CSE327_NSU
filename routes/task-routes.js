const express = require('express');
const router = express.Router();
const taskController = require('../controllers/task-controller');

const isAuthenticated = (req, res, next) => {
  if (req.session.userId) return next();
  res.redirect('/login');
};

// List tasks for a project
router.get('/:projectId/tasks', isAuthenticated, taskController.getTasks);

// Create a new task
router.post('/:projectId/tasks/create', isAuthenticated, taskController.createTask);

// Update task status — Use projectId param to redirect properly
router.post('/:projectId/tasks/update-status', isAuthenticated, taskController.updateTaskStatus);

module.exports = router;
