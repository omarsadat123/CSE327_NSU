// controllers/task-controller.js
const Task = require('../models/task-model'); // Adjust path if needed

/**
 * Renders the task creation page for a specific project.
 *
 * Retrieves all tasks, participants, and the project name for the given project ID,
 * then renders the 'task-create' view with the retrieved data.
 *
 * @async
 * @function getTasks
 * @param {import('express').Request} req - Express request object.
 * @param {Object} req.params - URL parameters.
 * @param {string} req.params.projectId - The ID of the project to retrieve tasks for.
 * @param {import('express').Response} res - Express response object.
 * @returns {Promise<void>} Sends an HTML response rendering the tasks page,
 * or an error page with status 500 if retrieval fails.
 *
 * @example
 * // Route usage in Express:
 * router.get('/projects/:projectId/tasks', taskController.getTasks);
 */

// Render tasks page for a specific project
exports.getTasks = async (req, res) => {
  try {
    const projectId = req.params.projectId;
    const tasks = await Task.getByProjectId(projectId);
    const participants = await Task.getParticipantsByProject(projectId);
    const projectName = await Task.getProjectNameById(projectId);

    res.render('task-create', { tasks, participants, projectName, projectId });
  } catch (err) {
    console.error('Error fetching tasks:', err.message);
    res.status(500).send('<h1>Server Error</h1><p>Could not load tasks.</p>');
  }
};

/**
 * Creates a new task for a given project and assigns it to one or more users.
 *
 * Reads task details from the request body, inserts the task into the database,
 * and optionally assigns the task to specified user(s). Redirects to the project's
 * task list page upon success.
 *
 * @async
 * @function createTask
 * @param {import('express').Request} req - Express request object.
 * @param {Object} req.body - Task details from the submitted form.
 * @param {string} req.body.task_name - The name/title of the task.
 * @param {string} req.body.task_description - A description of the task.
 * @param {string} req.body.task_status - The current status of the task (e.g., "open", "in-progress", "done").
 * @param {string|null} [req.body.task_deadline] - The deadline date for the task (optional).
 * @param {string} req.body.task_priority - The priority level of the task (e.g., "low", "medium", "high").
 * @param {string} req.body.task_category - The category or type of the task.
 * @param {string|number} req.body.projectId - The ID of the project the task belongs to.
 * @param {string|string[]} [req.body.assigned_uid] - One or more user IDs to assign the task to (optional).
 * @param {import('express').Response} res - Express response object.
 * @returns {Promise<void>} Redirects to the project's task list page upon success,
 * or sends a 500 error response if creation fails.
 *
 * @example
 * // Route usage in Express:
 * router.post('/projects/:projectId/tasks', taskController.createTask);
 */

// Create a new task
exports.createTask = async (req, res) => {
  try {
    const {
      task_name,
      task_description,
      task_status,
      task_deadline,
      task_priority,
      task_category,
      projectId,
      assigned_uid,
    } = req.body;

    const result = await Task.create(
      task_name,
      task_status,
      task_deadline || null,
      task_description,
      task_priority,
      task_category,
      projectId
    );

    const newTaskId = result.insertId;

    // Normalize assigned_uid to array
    const assignedUsers = assigned_uid
      ? Array.isArray(assigned_uid)
        ? assigned_uid
        : [assigned_uid]
      : [];

    for (const uid of assignedUsers) {
      await Task.assignUser(uid, newTaskId);
    }

    res.redirect(`/projects/${projectId}/tasks`);
  } catch (err) {
    console.error('Error creating task:', err.message);
    res.status(500).send(
      '<h1>Server Error</h1><p>Could not create a new task. Check server console for details.</p>'
    );
  }
};

/**
 * Updates the status of an existing task.
 *
 * Reads the task ID and new status from the request body, updates the task's
 * status in the database, and redirects back to the project's task list page.
 *
 * @async
 * @function updateTaskStatus
 * @param {import('express').Request} req - Express request object.
 * @param {Object} req.params - Route parameters.
 * @param {string|number} req.params.projectId - The ID of the project the task belongs to.
 * @param {Object} req.body - Request body containing task update data.
 * @param {string|number} req.body.task_id - The ID of the task to update.
 * @param {string} req.body.status - The new status of the task (e.g., "open", "in-progress", "done").
 * @param {import('express').Response} res - Express response object.
 * @returns {Promise<void>} Redirects to the project's task list page on success,
 * or sends a 500 error response if the update fails.
 *
 * @example
 * // Route usage in Express:
 * router.post('/projects/:projectId/tasks/update-status', taskController.updateTaskStatus);
 */

// Update a task's status
exports.updateTaskStatus = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { task_id, status } = req.body;

    await Task.updateStatus(task_id, status);

    // Redirect back to the same task list page for this project
    res.redirect(`/projects/${projectId}/tasks`);
  } catch (err) {
    console.error('Error updating task status:', err.message);
    res.status(500).send('<h1>Server Error</h1><p>Could not update task status.</p>');
  }
};
