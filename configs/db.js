<<<<<<< HEAD
/**
 * @file Database configuration for ProCollab.
 * @module configs/db
 * @description Configures and exports a MySQL connection pool using `mysql2/promise`.
 */
=======
// config/db.js
const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',      // Your DB host
  user: 'root',           // Your DB username
  password: '',           // Your DB password
  database: 'procollab'   // Your DB name
});

connection.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err.stack);
    return;
  }
  console.log('Connected to MySQL database');
});

module.exports = connection;

>>>>>>> 8ee198a709fb22b91d8f963cce24d28a9f7fb20b

const mysql = require('mysql2/promise');

/**
 * MySQL connection pool configuration.
 * @type {Object}
 * @property {string} host - Database host (default: 'localhost').
 * @property {string} user - Database username (default: 'root').
 * @property {string} password - Database password (default: '').
 * @property {string} database - Database name (default: 'procollab').
 * @property {boolean} waitForConnections - Whether to queue connections if all are busy (default: `true`).
 * @property {number} connectionLimit - Maximum number of concurrent connections (default: `10`).
 * @property {number} queueLimit - Maximum number of queued connection requests (default: `0`).
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
 * @global
 * @example
 * // Usage in another file:
 * // const db = require('./configs/db');
 * // const [rows] = await db.query('SELECT * FROM users');
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
    throw err;
  });

module.exports = db;
