const express = require('express');
const router = express.Router();
const collaboratorController = require('../controllers/collaborator-controller');



function isAuthenticated(req, res, next) {
  if (req.session.userId) return next();
  res.status(401).send('Unauthorized access.');
}

// Renders the invite form page
exports.showCollaboratorForm = (req, res) => {
  res.render('invite-form', { projectId: req.params.pid });
};
router.get('/projects/:pid/collaborators/invite', isAuthenticated, collaboratorController.showCollaboratorForm);

router.post('/projects/:pid/collaborators/invite', isAuthenticated, collaboratorController.sendCollaboratorInvite);
// controllers/collaborator-controller.js

// Renders the invite form page
exports.showCollaboratorForm = (req, res) => {
  res.render('invite-form', { projectId: req.params.pid });
};


module.exports = router;
