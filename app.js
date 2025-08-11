<<<<<<< HEAD
const express = require('express');
const session = require('express-session');
const path = require('path');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: 'secretkey', resave: false, saveUninitialized: true }));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const resetRoutes = require('./routes/password-reset-routes');
app.use('/', resetRoutes);

app.listen(3000, () => console.log('Server started at http://localhost:3000'));
=======
/**
 * @file Main application entry point for ProCollab.
 * @module app
 * @description Configures Express server, middleware, routes, and session management.
 */

const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const authRoutes = require('./routes/auth-routes');

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

app.use('/dashboard', require('./routes/dashboard-routes'));

app.use('/', authRoutes);



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

// For 404 - Not Found
app.use((req, res) => {
  res.status(404).send('404 Not Found');
});

// For 500 - Internal Server Error
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send('Internal Server Error');
});
>>>>>>> 1e877ea8136e6cd9415faaa00235d7dd47a83f4c
