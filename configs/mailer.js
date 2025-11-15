/**
 * Gmail transporter configuration for nodemailer
 */

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: '', //smtp mail
    pass: '' // Use App Password if 2FA is enabled
  }
});

module.exports = transporter;
