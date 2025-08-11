// controllers/taskController.js
const Task = require('../models/task-model');

// Function to render the main page with all tasks
exports.getTasks = async (req, res) => {
  try {
    const projectId = req.params.projectId;
    const tasks = await Task.getByProjectId(projectId);
    //const participants = await Task.getParticipants();
    const participants = await Task.getParticipantsByProject(projectId);
    // Fetch project name
    const projectName = await Task.getProjectNameById(projectId);

    res.render('task-create', { tasks, participants,projectName,projectId });
  } catch (err) {
    console.error('Error fetching tasks from the database:', err.message);
    res.status(500).send('<h1>Server Error</h1><p>Could not load tasks.</p>');
  }
};



// Function to handle new task creation
exports.createTask = async (req, res) => {
  try {
    const { task_name, task_description, task_status, task_deadline, task_priority, task_category, project_id, assigned_uid } = req.body;
    const result= await Task.create(task_name, task_status, task_deadline ?? null, task_description, task_priority, task_category, project_id);

    // Get the inserted task ID
    const newTaskId = result.insertId;

    // Ensure assigned_uid is always treated as an array
    const assignedUsers = assigned_uid ? (Array.isArray(assigned_uid) ? assigned_uid : [assigned_uid]) : [];


 // Assign each user
    for (const uid of assignedUsers) {
      await Task.assignUser(uid, newTaskId); // You should have assignUser function in your model
    }
     res.redirect(`/projects/${project_id}`);
  } catch (err) {
    console.error('Error creating a new task:', err.message);
    // Send a user-friendly error message to the browser
    res.status(500).send('<h1>Server Error</h1><p>Could not create a new task. Please check the server console for details.</p>');
  }
};

// Function to update task status
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

