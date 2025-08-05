// server.js
const express = require('express');
const path = require('path');
const taskRoutes = require('./routes/task-routes');
const db = require('./configs/db'); // Import the database connection pool

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
    process.exit(1); // Exit with a failure code
  }
};

startServer();