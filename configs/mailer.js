// config/mailer.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail', // Use your email service (e.g., Gmail)
    auth: {
        user: process.env.EMAIL_USER, // Your email address (from .env)
        pass: process.env.EMAIL_PASS  // Your email password (from .env)
    }
});

module.exports = transporter;
