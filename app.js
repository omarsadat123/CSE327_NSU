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