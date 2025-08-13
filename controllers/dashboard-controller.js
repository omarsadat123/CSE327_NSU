/**
 * @file Dashboard controller for ProCollab
 * @module controllers/dashboard-controller
 * @description Handles dashboard rendering and data loading
 */

const Dashboard = require('../models/dashboard');

/**
 * Checks if user is logged in before allowing access
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {function} next - Next middleware function
 */
const ensureAuthenticated = (req, res, next) => {
  if (!req.session.userId) {
    return res.redirect('/login');
  }
  next();
};

/**
 * Loads and displays the dashboard page
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
const getDashboard = async (req, res) => {
  try {
    const userId = req.session.userId;
    const user =
      req.session.user || (await Dashboard.getUserById(userId));

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
      upcomingTasks
    });
  } catch (err) {
    console.error('Dashboard error:', err);
    res.status(500).render('error', {
      message: 'Failed to load dashboard'
    });
  }
};

module.exports = {
  ensureAuthenticated,
  getDashboard
};
