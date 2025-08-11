// models/auth.js
const db = require('../configs/db'); // adjust path to your DB connection

module.exports = {
  async findUserByEmailAndPassword(email, password) {
    // Step 1: Find the user by email
    const [userRows] = await db.query(
      'SELECT uid, name, email FROM users WHERE email = ?',
      [email]
    );

    if (userRows.length === 0) {
      return null; // Email not found
    }

    const user = userRows[0];

    // Step 2: Check the password in the credentials table
    const [credRows] = await db.query(
      'SELECT password FROM credentials WHERE uid = ? AND password = ?',
      [user.uid, password]
    );

    if (credRows.length === 0) {
      return null; // Password incorrect
    }

    // Step 3: Return the user details
    return user;
  }
};
