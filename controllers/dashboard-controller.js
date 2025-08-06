const Dashboard = require('../models/dashboard');

exports.getDashboard = async (req, res) => {
  try {
    const userId = req.session.userId;

    const user = await Dashboard.getUserById(userId);
    const projectCounts = await Dashboard.getActiveProjectCounts(userId);
    const pendingTasksCount = await Dashboard.getPendingTasksCount(userId);
    const ownedProjects = await Dashboard.getOwnedProjects(userId);
    const joinedProjects = await Dashboard.getJoinedProjects(userId);
    const upcomingTasks = await Dashboard.getUpcomingTasks(userId);

    res.render('dashboard', {
      user,
      projectCounts,
      pendingTasksCount,
      ownedProjects,
      joinedProjects,
      upcomingTasks
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};
