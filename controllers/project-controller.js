const Project = require('../models/project');

exports.createProject = async (req, res) => {
  try {
    const userId = req.session.userId || 1; // bypass for now
    const { name, description, visibility, status } = req.body;

    await Project.create({ name, description, visibility, status, userId });

    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error creating project');
  }
};
