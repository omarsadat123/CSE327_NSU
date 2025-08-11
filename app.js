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
