const mysql = require('mysql2/promise');

const db = mysql.createPool({
  host: 'localhost', // DB host
  user: 'root', // DB username
  password: '', // DB password
  database: 'procollab', // DB name
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = db;
