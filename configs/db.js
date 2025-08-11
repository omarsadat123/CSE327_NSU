/**
 * Database Configuration
 * ----------------------
 * Creates and exports a MySQL connection pool.
 * Follows project coding standards for naming, structure, and documentation.
 */

const mysql = require('mysql2');

// Create the connection pool
const pool = mysql.createPool({
    host: 'localhost',            // Database host
    user: 'root',                  // Database username
    password: '',                  // Database password
    database: 'procollab',         // Database name
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test the connection
pool.getConnection((error, connection) => {
    if (error) {
        console.error(`Database connection failed: ${error.message}`);
    } else {
        console.log('Connected to MySQL Database: procollab');
        connection.release();
    }
});

// Export the promise-based pool
module.exports = pool.promise();
