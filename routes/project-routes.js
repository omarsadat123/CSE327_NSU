/**
 * @file Project routes for ProCollab
 * @module routes/project-routes
 * @description Handles all project-related routes
 */

const express = require('express');
const router = express.Router();
const projectController = require('../controllers/project-controller');

/**
 * Route for creating new projects
 * @name POST /projects/create
 * @function
 * @param {string} path - Route path ('/create')
 * @param {function} handler - Project creation controller
 * 
 * @example
 * // Client-side usage:
 * fetch('/projects/create', {
 *   method: 'POST',
 *   headers: { 'Content-Type': 'application/json' },
 *   body: JSON.stringify({
 *     name: 'New Project',
 *     visibility: 'private',
 *     userId: 123
 *   })
 * });
 */
router.post('/create', projectController.createProject);

module.exports = router;
