const express = require('express');
const router = express.Router();
const controller = require('../controllers/password-reset-controller');

router.get('/change-password', controller.getPage);
router.post('/send-code', controller.sendCode);
router.post('/verify-code', controller.verifyCode);
router.post('/set-new-password', controller.setPassword);

module.exports = router;
