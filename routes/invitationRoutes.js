const express = require('express');
const router = express.Router();
const invitationController = require('../controllers/invitationController');

// Authentication middleware, quick inline version:
const isAuthenticated = (req, res, next) => {
  if (req.session.userId) return next();
  res.redirect('/login');
};

// Use auth middleware on all invitation routes:
router.use(isAuthenticated);

// Show invitations list
router.get('/', invitationController.viewInvitations);

// Accept invitation
router.post('/accept/:pid', invitationController.acceptInvitation);

// Reject invitation
router.post('/reject/:pid', invitationController.rejectInvitation);

module.exports = router;
