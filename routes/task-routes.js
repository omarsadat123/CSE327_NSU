// routes/taskRoutes.js
const express = require('express');
const router = express.Router();
const task_controller = require('../controllers/task-controller');



// Route to get the main page (GET /)
router.get('/', task_controller.getTasks);

// Route to create a new task (POST /)
router.post('/', task_controller.createTask);

router.post('/update-status', task_controller.updateTaskStatus);


module.exports = router;