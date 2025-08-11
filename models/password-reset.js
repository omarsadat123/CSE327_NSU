// models/password-reset.js
const db = require('../configs/db');

exports.findUserByEmail = (email, callback) => {
  db.query('SELECT uid FROM users WHERE email = ?', [email], callback);
};

exports.updatePassword = (uid, hashedPassword, callback) => {
  db.query('UPDATE credentials SET password = ? WHERE uid = ?', [hashedPassword, uid], callback);
};
