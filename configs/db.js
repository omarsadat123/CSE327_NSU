/**
 * @file MySQL database configuration
 * @module configs/db
 */

const mysql = require('mysql2/promise');

// Database connection pool configuration
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'procollab',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Create connection pool
const db = mysql.createPool(dbConfig);

// Verify connection on startup
db.getConnection()
  .then((connection) => {
    console.log('MySQL connected');
    connection.release();
  })
  .catch((err) => {
    console.error('MySQL connection error:', err);
    process.exit(1);
  });

module.exports = db;
