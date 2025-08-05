// config/db.js
const mysql = require('mysql2/promise');

// MySQL database configuration
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root', // Your XAMPP MySQL username
  password: '', // Your XAMPP MySQL password
  database: 'procollab', // The database you created in phpMyAdmin
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;