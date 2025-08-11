/**
 * ProCollab Application Entry Point
 * Sets up the Express server, session store, routes, and middleware.
 */

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);

const db = require('./configs/db'); // MySQL pool connection
const authRoutes = require('./routes/auth'); // Authentication routes

const app = express();

// ----------------------------
// Session Store Configuration
// ----------------------------
const sessionStore = new MySQLStore({}, db);

// ----------------------------
// Middleware
// ----------------------------
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(session({
    key: 'procollab_sid',
    secret: 'procollab_session', // Replace with secure random value
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 // 1 hour
    }
}));

// ----------------------------
// View Engine Setup
// ----------------------------
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// ----------------------------
// Static Files
// ----------------------------
app.use(express.static(path.join(__dirname, 'public')));

// ----------------------------
// Routes
// ----------------------------

// GET login page
app.get('/login', (req, res) => {
    return res.render('login', { error: undefined });
});

// Authentication routes
app.use('/', authRoutes);

// Dashboard example
app.get('/dashboard', (req, res) => {
    if (!req.session.user) { // Session check
        return res.redirect('/login');
    }
    return res.send(`
        <h1>Welcome to ProCollab Dashboard!</h1>
        <p>User: ${req.session.user.name}</p>
        <p>Email: ${req.session.user.email}</p>
    `);
});

// ----------------------------
// Start Server
// ----------------------------
const PORT = 3000; // Static value (consider moving to .env)
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
