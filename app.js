/**
 * @file Main application entry point.
 * @module app
 * @description Configures Express server, middleware, routes, and session management.
 */

const express = require('express');
const session = require('express-session');
const path = require('path');
<<<<<<< HEAD
const authRoutes = require('./routes/auth-routes');
const dashboardRoutes = require('./routes/dashboard-routes');
const projectRoutes = require('./routes/project-routes');
const taskRoutes = require('./routes/task-routes'); // from incoming version
const db = require('./configs/db'); // DB connection

=======

// ======================
//  Express App Instance
// ======================
>>>>>>> 372cb7aacc1dd4aa03b85fb4c69adca967b24e1e
const app = express();
const PORT = process.env.PORT || 3000;

// ======================
// Middleware Setup
// ======================

<<<<<<< HEAD
// Session configuration middleware.
=======
/**
 * Session configuration middleware.
 * @see {@link https://www.npmjs.com/package/express-session}
 */
>>>>>>> 372cb7aacc1dd4aa03b85fb4c69adca967b24e1e
app.use(
  session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true in production with HTTPS
  })
);

<<<<<<< HEAD
// Body parsers
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Static files
=======
// ======================
//  Body Parsing
// ======================
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// ======================
//  View Engine Setup
// ======================
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ======================
//  Static Assets
// ======================
>>>>>>> 372cb7aacc1dd4aa03b85fb4c69adca967b24e1e
app.use(express.static(path.join(__dirname, 'public')));

// ======================
// View Engine Setup
// ======================

<<<<<<< HEAD
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ======================
// Route Configuration
// ======================

app.use('/dashboard', dashboardRoutes);
app.use('/', authRoutes);
app.use('/projects', projectRoutes);
app.use('/projects', taskRoutes);  // Mount task routes under /projects
=======
// Authentication routes
const authRoutes = require('./routes/auth-routes');
app.use('/', authRoutes);

// Dashboard routes
app.use('/dashboard', require('./routes/dashboard-routes'));

// Project routes
app.use('/projects', require('./routes/project-routes'));
>>>>>>> 372cb7aacc1dd4aa03b85fb4c69adca967b24e1e

// Password reset routes (from first snippet)
const resetRoutes = require('./routes/password-reset-routes');
app.use('/', resetRoutes);

// ======================
// Server Startup
// ======================
<<<<<<< HEAD

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
=======
app.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
  console.log('Environment:', process.env.NODE_ENV || 'development');
});
>>>>>>> 372cb7aacc1dd4aa03b85fb4c69adca967b24e1e

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
<<<<<<< HEAD

module.exports = app;
=======
>>>>>>> 372cb7aacc1dd4aa03b85fb4c69adca967b24e1e
