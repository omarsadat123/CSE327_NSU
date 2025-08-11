<<<<<<< HEAD
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
=======
// server.js
const express = require('express');
const path = require('path');
const taskRoutes = require('./routes/task-routes');
//  database connection pool
const db = require('./configs/db'); 

// Create the Express application
const app = express();
const PORT = process.env.PORT || 3000;

// Set up middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Set up the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Use the routes
app.use('/', taskRoutes);

// Start the server only after confirming the database connection
const startServer = async () => {
  try {
    // Attempt to get a connection to verify the database is reachable
    await db.getConnection();
    console.log('Successfully connected to the MySQL database!');
    
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Error connecting to the database or starting server:', err.message);
    console.error('Please ensure your MySQL service is running and the database configuration in config/db.js is correct.');
    // Exit with a failure code
    process.exit(1); 
  }
};

// Start the server only if this file is run directly
if (require.main === module) {
  startServer();
}

// Export the app for testing purposes
module.exports = app;
>>>>>>> b74f37dcb03291d8fb3aefccd5ccabdd982e6075
