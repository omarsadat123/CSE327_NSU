// controllers/invitationController.js
const Invitation = require('../models/invitation');

/**
 * Show all invitations for the logged-in user
 */
exports.viewInvitations = (req, res) => {
  if (!req.session || !req.session.userId) {
    return res.redirect('/login'); // Must be logged in
  }

  const uid = req.session.userId;

  Invitation.getInvitationsByUserId(uid, (err, invitations) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Server error');
    }

    res.render('invitations', {
      invitations, // Pass invitation list to the view
      user: req.session.user
    });
  });
};

/**
 * Accept an invitation
 */
exports.acceptInvitation = (req, res) => {
  if (!req.session || !req.session.userId) {
    return res.redirect('/login');
  }

  const uid = req.session.userId;
  const pid = req.params.pid;

  Invitation.acceptInvitation(uid, pid, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Server error');
    }

    req.flash('success', 'You have successfully joined the project.');
    res.redirect('/invitations');
  });
};

/**
 * Reject an invitation
 */
exports.rejectInvitation = (req, res) => {
  if (!req.session || !req.session.userId) {
    return res.redirect('/login');
  }

  const uid = req.session.userId;
  const pid = req.params.pid;

  Invitation.rejectInvitation(uid, pid, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Server error');
    }

    req.flash('info', 'You have declined the invitation.');
    res.redirect('/invitations');
  });
};
