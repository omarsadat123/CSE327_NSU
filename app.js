/**
 * @file Main application entry point for ProCollab.
 * @module app
 * @description Configures Express server, middleware, routes, and session management.
 */

const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');

/**
 * Express application instance.
 * @type {import('express').Application}
 */
const app = express();

// ======================
//  Middleware Setup
// ======================

/**
 * Session configuration middleware.
 * @name use/session
 * @memberof module:app
 * @function
 * @param {Object} config - Session configuration
 * @param {string} config.secret - Secret key for session encryption
 * @param {boolean} config.resave - Force session save even when unmodified
 * @param {boolean} config.saveUninitialized - Save uninitialized sessions
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

/**
 * Development authentication bypass middleware.
 * @name use/authBypass
 * @memberof module:app
 * @function
 * @description FOR DEVELOPMENT ONLY - Auto-authenticates as user ID 1
 * @todo Remove in production
 */
app.use((req, res, next) => {
  req.session.userId = 1; // Development user ID
  next();
});

// ======================
//  View Engine Setup
// ======================

/**
 * Configures EJS templating engine.
 * @name set/viewEngine
 * @memberof module:app
 * @function
 * @param {string} 'view engine' - Template engine name
 * @param {string} 'ejs' - Engine to use
 */
app.set('view engine', 'ejs');

/**
 * Sets views directory path.
 * @name set/views
 * @memberof module:app
 * @function
 * @param {string} 'views' - View setting name
 * @param {string} path.join(__dirname, 'views') - Path to views directory
 */
app.set('views', path.join(__dirname, 'views'));

// ======================
//  Body Parsing
// ======================

/**
 * URL-encoded body parser middleware.
 * @name use/bodyParser-urlencoded
 * @memberof module:app
 * @function
 * @param {Object} options - Parser options
 * @param {boolean} options.extended - Parse extended syntax
 */
app.use(bodyParser.urlencoded({ extended: true }));

/**
 * JSON body parser middleware.
 * @name use/bodyParser-json
 * @memberof module:app
 * @function
 */
app.use(bodyParser.json());

// ======================
//  Static Assets
// ======================

/**
 * Static file serving middleware.
 * @name use/static
 * @memberof module:app
 * @function
 * @param {string} path.join(__dirname, 'public') - Path to static assets
 */
app.use(express.static(path.join(__dirname, 'public')));

// ======================
//  Route Configuration
// ======================

/**
 * Dashboard routes middleware.
 * @name use/dashboardRoutes
 * @memberof module:app
 * @function
 * @param {string} '/dashboard' - Base path for dashboard routes
 * @param {Router} dashboardRoutes - Imported dashboard router
 */
app.use('/dashboard', require('./routes/dashboard-routes'));

/**
 * Project routes middleware.
 * @name use/projectRoutes
 * @memberof module:app
 * @function
 * @param {string} '/projects' - Base path for project routes
 * @param {Router} projectRoutes - Imported project router
 */
app.use('/projects', require('./routes/project-routes'));

// ======================
//  Server Startup
// ======================

/**
 * Starts the Express server.
 * @name listen
 * @memberof module:app
 * @function
 * @param {number} 3000 - Port number
 * @param {function} callback - Server startup callback
 */
app.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
  console.log('Environment:', process.env.NODE_ENV || 'development');
});

// ======================
//  Error Handling
// ======================

/**
 * 404 Error Handler
 * @name use/404
 * @memberof module:app
 * @function
 */
app.use((req, res) => {
  res.status(404).render('404');
});

/**
 * Global Error Handler
 * @name use/error
 * @memberof module:app
 * @function
 * @param {Error} err - Error object
 */
app.use((err, req, res, next) => {
  console.error('Global error:', err);
  res.status(500).render('error', { message: 'Something went wrong!' });
});