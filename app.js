const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

// Session setup
app.use(
  session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
  })
);

// Fake login for testing
app.use((req, res, next) => {
  req.session.userId = 1; // Always use user with ID = 1
  next();
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files if any
app.use(express.static(path.join(__dirname, 'public')));

// Routes
const dashboardRoutes = require('./routes/dashboard-routes');
app.use('/dashboard', dashboardRoutes);

const projectRoutes = require('./routes/project-routes');
app.use('/projects', projectRoutes);

app.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
