/**
 * @file Project routes for ProCollab.
 * @module routes/project-routes
 * @description Defines all project-related routes.
 */

const express = require('express');
const router = express.Router();
const projectController = require('../controllers/project-controller');

/**
 * Project creation route.
 * @name POST/project/create
 * @function
 * @memberof module:routes/project-routes
 * @inner
 * @param {string} path - Express path ('/create').
 * @param {Function} handler - Project creation controller.
 * @example
 * // Usage in app.js:
 * app.use('/projects', require('./routes/project-routes'));
 * 
 * // Example request:
 * fetch('/projects/create', {
 *   method: 'POST',
 *   body: JSON.stringify({ name: 'New Project', visibility: 'private' })
 * });
 */
router.post('/create', projectController.createProject);

module.exports = router;