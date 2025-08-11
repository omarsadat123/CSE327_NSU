const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'mahfuzurrahman594@gmail.com',
    pass: 'uyrzketvbmwbioco' // Use App Password if 2FA is enabled
  }
});

module.exports = transporter;
