/**
 * @file Project controller for ProCollab.
 * @module controllers/project-controller
 * @description Handles project creation and related operations.
 */

const Project = require('../models/project');

/**
 * Creates a new project and redirects to dashboard.
 * @async
 * @function createProject
 * @param {import('express').Request} req - Express request object.
 * @param {Object} req.session - User session data.
 * @param {number} [req.session.userId=1] - Authenticated user's ID (temporary fallback to 1).
 * @param {Object} req.body - Project creation data.
 * @param {string} req.body.name - Project name (required).
 * @param {string} [req.body.description=""] - Project description.
 * @param {string} req.body.visibility - Project visibility ('public'|'private').
 * @param {string} [req.body.status="active"] - Initial project status.
 * @param {import('express').Response} res - Express response object.
 * @returns {Promise<void>}
 * @throws {Error} If project creation fails.
 * @example
 * // Route definition:
 * router.post('/projects', projectController.createProject);
 */
exports.createProject = async (req, res) => {
  try {
    const userId = req.session.userId || 1; // Temporary development bypass
    const { 
      name, 
      description = "", 
      visibility, 
      status = "active" 
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