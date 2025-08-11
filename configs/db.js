/**
 * @file Database configuration for ProCollab.
 * @module configs/db
 * @description Configures and exports a MySQL connection pool using `mysql2/promise`.
 */

const mysql = require('mysql2/promise');

/**
 * MySQL connection pool configuration.
 * @type {Object}
 */
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'procollab',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

/**
 * MySQL connection pool instance.
 * @type {import('mysql2/promise').Pool}
 */
const db = mysql.createPool(dbConfig);

// Test the connection on startup
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
