/**
 * Authentication Controller
 * Handles signup, OTP verification, and login processes.
 */

const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');

const UserModel = require('../models/users.model');
const LoginModel = require('../models/login.model');

/**
 * Signup Controller
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function signup(req, res) {
    try {
        const { name, email, password } = req.body;

        // Create user in DB
        const uid = await UserModel.createUser(name, email);

        // Hash password and store credentials
        const passwordHash = await bcrypt.hash(password, 10);
        await UserModel.storePassword(uid, passwordHash);

        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000);

        // Store OTP in session
        req.session.otp = otp;
        req.session.uid = uid;

        // Send OTP email
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'hossainahammedphp@gmail.com',
                pass: 'ymbwtmbajxrymxhd' // Gmail app password
            }
        });

        const mailOptions = {
            from: 'hossainahammedphp@gmail.com',
            to: email,
            subject: 'Your OTP Code',
            text: `Your OTP is: ${otp}`
        };

        await transporter.sendMail(mailOptions);

        // Redirect to OTP page
        res.redirect(`/verifyOtp?uid=${uid}`);
    } catch (error) {
        console.error('Signup Error:', error);
        res.status(500).send('Server Error');
    }
}

/**
 * OTP Verification Controller
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function verifyOtp(req, res) {
    const { uid, otp } = req.body;

    if (
        parseInt(otp, 10) === req.session.otp &&
        parseInt(uid, 10) === req.session.uid
    ) {
        req.session.otp = null;
        req.session.uid = null;
        res.redirect('/login');
    } else {
        res.status(400).send('Invalid OTP');
    }
}

/**
 * Login Controller
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function login(req, res) {
    try {
        const { email, password } = req.body;

        // Get user from model
        const user = await LoginModel.getUserWithCredentials(email);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Compare password with hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Store user in session
        req.session.user = {
            uid: user.uid,
            name: user.name,
            email: user.email
        };
        // Respond with success
        // Redirect to dashboard later
        res.status(200).json({
            message: 'Login successful',
            user: {
                uid: user.uid,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

module.exports = {signup,verifyOtp,login};
