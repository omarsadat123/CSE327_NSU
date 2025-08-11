/**
 * Authentication Controller
 * Handles signup, OTP verification, and login processes.
 */

const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const UserModel = require('../models/users.model');
const LoginModel = require('../models/login.model');

// Temporary in-memory store for OTP + signup data
const pendingSignups = {};

/**
 * Handles user signup by generating OTP, hashing password, and sending OTP email.
 * Stores temporary signup data in memory until OTP verification.
 * 
 * @async
 * @function signup
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @returns {Promise<void>}
 */
async function signup(req, res) {
    try {
        const { name, email, password } = req.body;
        const normalizedEmail = email.trim().toLowerCase();

        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000);

        // Hash password now (store temporarily)
        const passwordHash = await bcrypt.hash(password, 10);

        // Store in memory
        pendingSignups[normalizedEmail] = { name, email: normalizedEmail, passwordHash, otp };

        // Send OTP via email
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'hossainahammedphp@gmail.com',
                pass: 'ymbwtmbajxrymxhd' // Gmail app password
            }
        });

        await transporter.sendMail({
            from: 'hossainahammedphp@gmail.com',
            to: normalizedEmail,
            subject: 'Your OTP Code',
            text: `Your OTP is: ${otp}`
        });

        // Redirect to OTP page
        res.redirect(`/verifyOtp?email=${encodeURIComponent(normalizedEmail)}`);
    } catch (error) {
        console.error('Signup Error:', error);
        res.status(500).send('Server Error');
    }
}

/**
 * Verifies the OTP entered by the user against the one generated during signup.
 * If valid, creates the user in the database and clears temporary data.
 * 
 * @async
 * @function verifyOtp
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @returns {Promise<void>}
 */
async function verifyOtp(req, res) {
    try {
        const email = req.body.email.trim().toLowerCase();
        const enteredOtp = parseInt(req.body.otp, 10);

        const pendingData = pendingSignups[email];

        if (!pendingData) {
            return res.render('verifyOtp', { 
                email, 
                error: 'No signup found for this email', 
                success: null 
            });
        }

        if (enteredOtp !== pendingData.otp) {
            return res.render('verifyOtp', { 
                email, 
                error: 'Invalid OTP', 
                success: null 
            });
        }

        // Save user in DB
        const uid = await UserModel.createUser(pendingData.name, pendingData.email);
        await UserModel.storePassword(uid, pendingData.passwordHash);

        // Remove from memory
        delete pendingSignups[email];

        return res.redirect('/login');
        
    } catch (error) {
        console.error('OTP Verification Error:', error);
        return res.render('verifyOtp', { 
            email: req.body.email || '', 
            error: 'Server error. Please try again.', 
            success: null 
        });
    }
}

/**
 * Authenticates a user by verifying credentials and starts a session.
 * 
 * @async
 * @function login
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @returns {Promise<void>}
 */
async function login(req, res) {
    try {
        const { email, password } = req.body;
        const user = await LoginModel.getUserWithCredentials(email.trim().toLowerCase());

        if (!user) {
            return res.render('/login', { error: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.render('/login', { error: 'Invalid credentials' });
        }

       res.status(500).send('Success');
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).send('Server error');
    }
}

module.exports = { signup, verifyOtp, login };
