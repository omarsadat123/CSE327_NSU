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
const collaboratorRoutes = require('./routes/collaborator-routes'); // Added collaborator routes
const invitationRoutes = require('./routes/invitationRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware Setup
app.use(session({
  secret: process.env.SESSION_SECRET || 'your_secret_key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Change to true in production with HTTPS
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', authRoutes);
app.use('/', resetRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/projects', projectRoutes);
app.use('/projects', taskRoutes); // For project-specific task routes, e.g., /projects/:projectId/tasks
app.use('/tasks', taskRoutes);    // For task-specific routes, e.g., /tasks/update-status
app.use('/projects', collaboratorRoutes); // Mounted collaborator routes on /projects
app.use('/invitations', invitationRoutes);

// Server Startup
const startServer = async () => {
  try {
    await db.getConnection();
    console.log('Successfully connected to the MySQL database!');

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
      console.log('Environment:', process.env.NODE_ENV || 'development');
    });
  } catch (err) {
    console.error('Error connecting to DB or starting server:', err.message);
    process.exit(1);
  }
};

if (require.main === module) {
  startServer();
}

// Error handling
app.use((req, res) => {
  res.status(404).send('404 Not Found');
});
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Internal Server Error');
});

module.exports = app;
