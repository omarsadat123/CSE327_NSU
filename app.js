/**
 * @file Main application entry point for ProCollab.
 * @module app
 * @description Configures Express server, middleware, routes, and session management.
 */

const express = require('express');
const session = require('express-session');
const path = require('path');
const authRoutes = require('./routes/auth-routes');
const dashboardRoutes = require('./routes/dashboard-routes');
const projectRoutes = require('./routes/project-routes');
const taskRoutes = require('./routes/task-routes'); // from incoming version
const db = require('./configs/db'); // DB connection

const app = express();
const PORT = process.env.PORT || 3000;

// ======================
// Middleware Setup
// ======================

// Session configuration middleware.
app.use(
  session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true in production with HTTPS
  })
);

// Body parsers
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// ======================
// View Engine Setup
// ======================

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ======================
// Route Configuration
// ======================

app.use('/dashboard', dashboardRoutes);
app.use('/', authRoutes);
app.use('/projects', projectRoutes);
app.use('/projects', taskRoutes);  // Mount task routes under /projects

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
