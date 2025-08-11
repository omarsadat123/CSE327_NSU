<<<<<<< HEAD
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'mahfuzurrahman594@gmail.com',
    pass: 'uyrzketvbmwbioco' // Use App Password if 2FA is enabled
  }
=======
// config/mailer.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail', // Use your email service (e.g., Gmail)
    auth: {
        user: process.env.EMAIL_USER, // Your email address (from .env)
        pass: process.env.EMAIL_PASS  // Your email password (from .env)
    }
>>>>>>> 8ee198a709fb22b91d8f963cce24d28a9f7fb20b
});

module.exports = transporter;
