/**
 * @file Dashboard controller for ProCollab.
 * @module controllers/dashboard-controller
 * @description Handles dashboard view rendering and data aggregation.
 */

const Dashboard = require('../models/dashboard');

/**
 * Middleware to ensure the user is authenticated before accessing dashboard.
 * Can be moved to a separate middleware file if reused elsewhere.
 */
function ensureAuthenticated(req, res, next) {
  if (!req.session.userId) {
    return res.redirect('/login');
  }
  next();
}

/**
 * Renders the dashboard page with user-specific data.
 * @async
 * @function getDashboard
 * @param {import('express').Request} req - Express request object.
 * @param {Object} req.session - User session data.
 * @param {number} req.session.userId - Authenticated user's ID.
 * @param {Object} req.session.user - Authenticated user's info (name, email, etc.).
 * @param {import('express').Response} res - Express response object.
 * @returns {Promise<void>}
 */
async function getDashboard(req, res) {
  try {
    const userId = req.session.userId;

    // If login stored the full user object, we can use it directly
    // Otherwise, fall back to DB query
    const user = req.session.user || await Dashboard.getUserById(userId);

    // Fetch all dashboard-related counts and lists in parallel
    const [
      projectCounts,
      pendingTasksCount,
      ownedProjects,
      joinedProjects,
      upcomingTasks
    ] = await Promise.all([
      Dashboard.getActiveProjectCounts(userId),
      Dashboard.getPendingTasksCount(userId),
      Dashboard.getOwnedProjects(userId),
      Dashboard.getJoinedProjects(userId),
      Dashboard.getUpcomingTasks(userId)
    ]);

    res.render('dashboard', {
      user,
      projectCounts,
      pendingTasksCount,
      ownedProjects,
      joinedProjects,
      upcomingTasks,
    });
  } catch (err) {
    console.error('Dashboard render error:', err);
    res.status(500).render('error', { 
      message: 'Failed to load dashboard data' 
    });
  }
}

module.exports = {
  ensureAuthenticated,
  getDashboard
};
