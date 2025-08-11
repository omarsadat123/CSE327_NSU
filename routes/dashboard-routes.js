/**
 * @file Dashboard routes for ProCollab.
 * @module routes/dashboard-routes
 * @description Defines all dashboard-related routes and authentication middleware.
 */

const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard-controller');

/**
 * Authentication middleware.
 * @function isAuthenticated
 * @param {import('express').Request} req - Express request object.
 * @param {Object} req.session - Session data.
 * @param {number} [req.session.userId] - Authenticated user ID.
 * @param {import('express').Response} res - Express response object.
 * @param {import('express').NextFunction} next - Express next middleware function.
 * @returns {void}
 * @throws {Redirect} Redirects to '/login' if unauthenticated.
 */
const isAuthenticated = (req, res, next) => {
  if (req.session.userId) return next();
  res.redirect('/login');
};

/**
 * Dashboard root route.
 * @name GET/dashboard
 * @function
 * @memberof module:routes/dashboard-routes
 * @inner
 * @param {string} path - Express path ('/').
 * @param {Function} middleware - Authentication check.
 * @param {Function} handler - Dashboard controller.
 * @example
 * // Usage in app.js:
 * app.use('/dashboard', require('./routes/dashboard-routes'));
 */
router.get('/', isAuthenticated, dashboardController.getDashboard);

module.exports = router;
