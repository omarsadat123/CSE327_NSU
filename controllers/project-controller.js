/**
 * @file Project controller for ProCollab
 * @module controllers/project-controller
 * @description Handles project creation and management
 */

const Project = require('../models/project');

/**
 * Creates a new project and redirects to dashboard
 * @param {object} req - Express request object
 * @param {object} req.session - User session data
 * @param {number} [req.session.userId=1] - User ID (temporary fallback to 1)
 * @param {object} req.body - Project data
 * @param {string} req.body.name - Project name (required)
 * @param {string} [req.body.description=""] - Project description
 * @param {string} req.body.visibility - Project visibility ('public' or 'private')
 * @param {string} [req.body.status="active"] - Initial status
 * @param {object} res - Express response object
 */
const createProject = async (req, res) => {
  try {
    const userId = req.session.userId || 1; // FIXME: Remove fallback before production
    const {
      name,
      description = '',
      visibility,
      status = 'active'
    } = req.body;

    if (!name || !visibility) {
      return res.status(400).json({ error: 'Name and visibility are required' });
    }

    await Project.create({ name, description, visibility, status, userId });
    res.redirect('/dashboard');
  } catch (err) {
    console.error('Project creation error:', err);
    res.status(500).render('error', {
      message: 'Project creation failed. Please try again.'
    });
  }
};

module.exports = {
  createProject
};