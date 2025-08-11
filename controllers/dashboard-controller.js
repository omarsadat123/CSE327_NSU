/**
 * @file Dashboard controller for ProCollab.
 * @module controllers/dashboard-controller
 * @description Handles dashboard view rendering and data aggregation.
 */

const Dashboard = require('../models/dashboard');

/**
 * Renders the dashboard page with user-specific data.
 * @async
 * @function getDashboard
 * @param {import('express').Request} req - Express request object.
 * @param {Object} req.session - User session data.
 * @param {number} req.session.userId - Authenticated user's ID.
 * @param {import('express').Response} res - Express response object.
 * @returns {Promise<void>}
 * @throws {Error} If data fetching fails.
 * @example
 * // Route definition:
 * router.get('/dashboard', dashboardController.getDashboard);
 */
exports.getDashboard = async (req, res) => {
  try {
    const userId = req.session.userId;

    // Parallelize data fetching for better performance
    const [
      user,
      projectCounts,
      pendingTasksCount,
      ownedProjects,
      joinedProjects,
      upcomingTasks
    ] = await Promise.all([
      Dashboard.getUserById(userId),
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
};