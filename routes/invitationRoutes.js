// routes/invitationRoutes.js
const express = require('express');
const router = express.Router();
const invitationController = require('../controllers/invitationController');

// Show invitations list
router.get('/', invitationController.viewInvitations);

// Accept invitation
router.post('/accept/:pid', invitationController.acceptInvitation);

// Reject invitation
router.post('/reject/:pid', invitationController.rejectInvitation);

module.exports = router;
