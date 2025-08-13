/**
 * @file Dashboard routes for ProCollab
 * @module routes/dashboard-routes
 * @description Handles all dashboard routes and authentication
 */

const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard-controller');

/**
 * Checks if user is logged in
 * @param {object} req - Express request
 * @param {object} req.session - Session data
 * @param {number} [req.session.userId] - User ID if logged in
 * @param {object} res - Express response
 * @param {function} next - Next middleware
 */
const isAuthenticated = (req, res, next) => {
  if (req.session.userId) {
    return next();
  }
  res.redirect('/login');
};

/**
 * Main dashboard page route
 * @name GET /dashboard
 * @function
 * @param {string} path - Route path ('/')
 * @param {function} middleware - Authentication check
 * @param {function} handler - Dashboard controller
 */
router.get('/', isAuthenticated, dashboardController.getDashboard);

module.exports = router;
