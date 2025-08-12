// controllers/invitationController.js
const Invitation = require('../models/invitation');

exports.viewInvitations = async (req, res) => {
  try {
    if (!req.session || !req.session.userId) {
      return res.redirect('/login');
    }
    const invitations = await Invitation.getInvitationsByUserId(req.session.userId);
    res.render('invitations', {
      invitations,
      user: req.session.user,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

exports.acceptInvitation = async (req, res) => {
  try {
    if (!req.session || !req.session.userId) {
      return res.redirect('/login');
    }
    await Invitation.acceptInvitation(req.session.userId, req.params.pid);
    // Optionally, you can use flash or query param for messages
    res.redirect('/invitations');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

exports.rejectInvitation = async (req, res) => {
  try {
    if (!req.session || !req.session.userId) {
      return res.redirect('/login');
    }
    await Invitation.rejectInvitation(req.session.userId, req.params.pid);
    res.redirect('/invitations');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};
