const collaboratorModel = require('../models/collaborator');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'mahfuzurrahman594@gmail.com',
    pass: 'uyrzketvbmwbioco',
  },
});

module.exports = {
  showCollaboratorForm(req, res) {
    const pid = req.params.pid;
    res.render('collaborator-invite', { pid, message: null });
  },

  async sendCollaboratorInvite(req, res) {
    const { pid } = req.params;
    const { email } = req.body;
    const inviterId = req.session.userId;

    if (!inviterId) {
      return res.status(401).send('Unauthorized access.');
    }

    try {
      const user = await collaboratorModel.findUserByEmail(email);
      if (!user) {
        return res.render('collaborator-invite', { pid, message: 'User with this email does not exist.' });
      }

      const alreadyMember = await collaboratorModel.isUserInProject(user.uid, pid);
      if (alreadyMember) {
        return res.render('collaborator-invite', { pid, message: 'User is already a member of the project.' });
      }

      await collaboratorModel.addCollaboratorToProject(user.uid, pid);

      const projectName = await collaboratorModel.getProjectNameById(pid);
      const inviterName = await collaboratorModel.getUserNameById(inviterId);

      const mailOptions = {
        from: 'mahfuzurrahman594@gmail.com',
        to: email,
        subject: `Invitation to join project: ${projectName}`,
        text: `Hello ${user.name},\n\nYou have been invited by ${inviterName} to collaborate on the project "${projectName}". Please log in to your account to accept the invitation.\n\nBest regards,\nProCollab Team`,
      };

      await transporter.sendMail(mailOptions);

      res.render('collaborator-invite', { pid, message: 'Invitation sent successfully.' });
    } catch (error) {
      console.error(error);
      res.render('collaborator-invite', { pid, message: 'An error occurred. Please try again later.' });
    }
  },
};
