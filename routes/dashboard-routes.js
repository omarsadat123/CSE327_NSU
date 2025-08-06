const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard-controller');

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.session.userId) return next();
  res.redirect('/login');
};

router.get('/', isAuthenticated, dashboardController.getDashboard);

module.exports = router;
