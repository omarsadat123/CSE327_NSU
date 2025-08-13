/**
 * @file Main application setup and configuration
 * @module app
 */

const express = require('express');
const session = require('express-session');
const path = require('path');
const bodyParser = require('body-parser');

// Database and route imports
const db = require('./configs/db');
const authRoutes = require('./routes/auth-routes');
const dashboardRoutes = require('./routes/dashboard-routes');
const projectRoutes = require('./routes/project-routes');
const taskRoutes = require('./routes/task-routes');
const resetRoutes = require('./routes/password-reset-routes');
const collaboratorRoutes = require('./routes/collaborator-routes');
const invitationRoutes = require('./routes/invitationRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
  })
);

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// Route handlers
app.use('/', authRoutes);
app.use('/', resetRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/projects', projectRoutes);
app.use('/projects', taskRoutes);
app.use('/tasks', taskRoutes);
app.use('/projects', collaboratorRoutes);
app.use('/invitations', invitationRoutes);

/**
 * Starts the server and database connection
 */
const startServer = async () => {
  try {
    await db.getConnection();
    app.listen(PORT, () => {
      console.log(
        'Server running at ' + 'http://localhost:' + PORT + '/login'
      );
    });
  } catch (err) {
    console.error('Server startup failed:', err);
    process.exit(1);
  }
};

// Error handlers
app.use((req, res) => res.status(404).send('Not Found'));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send('Server Error');
});

// Start server if main module
if (require.main === module) startServer();

module.exports = app;
