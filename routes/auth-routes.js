const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth-controller');

router.get('/login', authController.showLoginPage);
router.post('/login', authController.login);

module.exports = router;