// controllers/task-controller.js
const Task = require('../models/task-model'); // Ensure this filename/path is exact

// Render tasks page for a specific project
exports.getTasks = async (req, res) => {
  try {
    const projectId = req.params.projectId; // Use 'projectId' to match route param
    const tasks = await Task.getByProjectId(projectId);
    const participants = await Task.getParticipantsByProject(projectId);
    const projectName = await Task.getProjectNameById(projectId);

    res.render('task-create', { tasks, participants, projectName, projectId });
  } catch (err) {
    console.error('Error fetching tasks from the database:', err.message);
    res.status(500).send('<h1>Server Error</h1><p>Could not load tasks.</p>');
  }
};

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

    // Create task
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

    // Assign users to task
    for (const uid of assignedUsers) {
      await Task.assignUser(uid, newTaskId);
    }

    res.redirect(`/projects/${projectId}/tasks`);
  } catch (err) {
    console.error('Error creating a new task:', err.message);
    res.status(500).send(
      '<h1>Server Error</h1><p>Could not create a new task. Check server console for details.</p>'
    );
  }
};

// Update a task's status
exports.updateTaskStatus = async (req, res) => {
  try {
    const { task_id, status } = req.body;
    await Task.updateStatus(task_id, status);
    res.redirect('back');
  } catch (err) {
    console.error('Error updating task status:', err.message);
    res.status(500).send('<h1>Server Error</h1><p>Could not update task status.</p>');
  }
};
