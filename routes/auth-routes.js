const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth-controller');

router.get('/login', authController.showLoginPage);
router.post('/login', authController.login);

// Add this logout route:
router.get('/logout', authController.logout);

module.exports = router;
