/**
 * Authentication Controller
 * Handles signup, OTP verification, and login processes (no password hashing).
 * 
 * This module provides three main functions:
 * - signup: Registers a user and sends OTP for verification.
 * - verifyOtp: Verifies OTP and stores user in the database.
 * - login: Authenticates a user using plain text password comparison.
 */

const nodemailer = require('nodemailer');
const UserModel = require('../models/users.model');
const LoginModel = require('../models/login.model');

// Temporary in-memory store for OTP + signup data
const pendingSignups = {};

/**
 * Handles user signup by generating OTP and sending OTP email.
 * Stores temporary signup data in memory until OTP verification.
 * 
 * @async
 * @function signup
 * @param {import('express').Request} req - Express request object containing `name`, `email`, and `password` in body.
 * @param {import('express').Response} res - Express response object.
 * @returns {Promise<void>} Redirects to OTP verification page or sends error.
 */
async function signup(req, res) {
    try {
        const { name, email, password } = req.body;
        const normalizedEmail = email.trim().toLowerCase();

        // Generate a 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000);

        // Store raw password (no hashing)
        pendingSignups[normalizedEmail] = { 
            name, 
            email: normalizedEmail, 
            password, 
            otp 
        };

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

        // Redirect to OTP verification page
        res.redirect(`/verifyOtp?email=${encodeURIComponent(normalizedEmail)}`);
    } catch (error) {
        console.error('Signup Error:', error);
        res.status(500).send('Server Error');
    }
}

/**
 * Verifies OTP and creates the user in the database with plain text password.
 * 
 * @async
 * @function verifyOtp
 * @param {import('express').Request} req - Express request object containing `email` and `otp` in body.
 * @param {import('express').Response} res - Express response object.
 * @returns {Promise<void>} Redirects to login page or renders OTP verification error.
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

        // Save user in DB (password stored as plain text)
        const uid = await UserModel.createUser(pendingData.name, pendingData.email);
        await UserModel.storePassword(uid, pendingData.password);

        // Remove temporary signup data
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
 * Authenticates user by comparing email and plain text password.
 * 
 * @async
 * @function login
 * @param {import('express').Request} req - Express request object containing `email` and `password` in body.
 * @param {import('express').Response} res - Express response object.
 * @returns {Promise<void>} Sends success message or renders login error.
 */
async function login(req, res) {
    try {
        const { email, password } = req.body;
        const user = await LoginModel.getUserWithCredentials(email.trim().toLowerCase());

        if (!user) {
            return res.render('login', { error: 'User not found' });
        }

        // Compare plain text passwords
        if (password !== user.password) {
            return res.render('login', { error: 'Invalid credentials' });
        }

        res.send('Login successful');
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).send('Server error');
    }
}

module.exports = { signup, verifyOtp, login };
