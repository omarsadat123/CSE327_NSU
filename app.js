<<<<<<< HEAD
/**
 * @file Main application entry point.
 * @module app
 * @description Configures Express server, middleware, routes, session management, and error handling.
 */

const express = require('express');
const session = require('express-session');
const path = require('path');
const bodyParser = require('body-parser');

const db = require('./configs/db'); // DB connection

const authRoutes = require('./routes/auth-routes');
const dashboardRoutes = require('./routes/dashboard-routes');
const projectRoutes = require('./routes/project-routes');
const taskRoutes = require('./routes/task-routes');
const resetRoutes = require('./routes/password-reset-routes');

const app = express();
const PORT = process.env.PORT || 3000;

// ======================
// Middleware Setup
// ======================

// Session configuration middleware.
// See https://www.npmjs.com/package/express-session
app.use(
  session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true in production with HTTPS
  })
);

// Body Parsing
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// View Engine Setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static Assets
app.use(express.static(path.join(__dirname, 'public')));

// ======================
// Route Configuration
// ======================

// Authentication routes
app.use('/', authRoutes);

// Password reset routes
app.use('/', resetRoutes);

// Dashboard routes
app.use('/dashboard', dashboardRoutes);

// Project routes
app.use('/projects', projectRoutes);

// Task routes mounted under /projects
app.use('/projects', taskRoutes);

// ======================
// Server Startup
// ======================

const startServer = async () => {
  try {
    // Check DB connection
    await db.getConnection();
    console.log('Successfully connected to the MySQL database!');

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
      console.log('Environment:', process.env.NODE_ENV || 'development');
    });
  } catch (err) {
    console.error('Error connecting to the database or starting server:', err.message);
    console.error('Please ensure your MySQL service is running and the database configuration in configs/db.js is correct.');
    process.exit(1);
  }
};

if (require.main === module) {
  startServer();
}

// ======================
// Error Handling
// ======================

// 404 - Not Found
app.use((req, res) => {
  res.status(404).send('404 Not Found');
});

// 500 - Internal Server Error
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send('Internal Server Error');
});

module.exports = app;
=======
const express = require('express');
const session = require('express-session');
const collaboratorRoutes = require('./routes/collaborator-routes');
const invitationRoutes = require('./routes/invitationRoutes');




const app = express();

// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Initialize session middleware first
app.use(session({
  secret: 'yoursecretkey',
  resave: false,
  saveUninitialized: true
}));

// Middleware to set userId for testing (after session middleware)
app.use((req, res, next) => {
  if (!req.session.userId) {
    req.session.userId = 1; // Set userId to 1 directly for testing
    req.session.user = { id: 1, name: 'Test User' }; // Optional user info
  }
  next();
});

// Set view engine
app.set('view engine', 'ejs');

// Static files
app.use(express.static('public'));

// Routes
app.use('/invitations', invitationRoutes);
app.use(collaboratorRoutes);

// Start server
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
>>>>>>> 8ee198a709fb22b91d8f963cce24d28a9f7fb20b
