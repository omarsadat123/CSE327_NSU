/**
 * ProCollab Application Entry Point
 * Sets up Express app, session handling, routes, and dashboard.
 */

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
// Removed MySQLStore import because it’s not used anymore

const authRoutes = require('./routes/auth');

const app = express();

// Middleware to parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Session middleware setup without DB session store
app.use(session({
  key: 'procollab_sid',
  secret: 'procollab_session',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 }
  // no store option here — using default MemoryStore
}));

// Set EJS as the view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Serve static files from public folder
app.use(express.static(path.join(__dirname, 'public')));

// Mount authentication routes at root path
app.use('/', authRoutes);

/**
 * GET /dashboard
 * Renders dashboard for logged-in users, otherwise redirects to login
 */
app.get('/dashboard', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    res.send(`
        <h1>Welcome to ProCollab Dashboard!</h1>
        <p>User: ${req.session.user.name}</p>
        <p>Email: ${req.session.user.email}</p>
    `);
});

// Start server on specified port or default 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
