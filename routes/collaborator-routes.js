const express = require('express');
const router = express.Router();
const collaboratorController = require('../controllers/collaborator-controller');

function isAuthenticated(req, res, next) {
  if (req.session.userId) return next();
  res.status(401).send('Unauthorized access.');
}

router.get('/:pid/collaborators/invite', isAuthenticated, collaboratorController.showCollaboratorForm);
router.post('/:pid/collaborators/invite', isAuthenticated, collaboratorController.sendCollaboratorInvite);


module.exports = router;
