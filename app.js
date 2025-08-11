/**
 * @file Main application entry point.
 * @module app
 * @description Configures Express server, middleware, routes, and session management.
 */

const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');

// ======================
//  Express App Instance
// ======================
const app = express();

// ======================
//  Middleware Setup
// ======================

/**
 * Session configuration middleware.
 * @see {@link https://www.npmjs.com/package/express-session}
 */
app.use(
  session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true in production with HTTPS
  })
);

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
app.use(express.static(path.join(__dirname, 'public')));

// ======================
//  Route Configuration
// ======================

// Authentication routes
const authRoutes = require('./routes/auth-routes');
app.use('/', authRoutes);

// Dashboard routes
app.use('/dashboard', require('./routes/dashboard-routes'));

// Project routes
app.use('/projects', require('./routes/project-routes'));

// Password reset routes (from first snippet)
const resetRoutes = require('./routes/password-reset-routes');
app.use('/', resetRoutes);

// ======================
//  Server Startup
// ======================
app.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
  console.log('Environment:', process.env.NODE_ENV || 'development');
});

// ======================
//  Error Handling
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
