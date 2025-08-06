const express = require('express');
const router = express.Router();
const projectController = require('../controllers/project-controller');

// Route to handle project creation form POST
router.post('/create', projectController.createProject);

module.exports = router;
