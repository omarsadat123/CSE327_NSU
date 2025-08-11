const db = require('../configs/db');
const bcrypt = require('bcryptjs');

module.exports = {
  /**
   * Find user by email and verify password
   * @param {string} email - User email
   * @param {string} plainPassword - Raw password entered by user
   * @returns {object|null} - User object if valid, else null
   */
  async findUserByEmailAndPassword(email, plainPassword) {
    // Step 1: Find user by email
    const [userRows] = await db.query(
      'SELECT uid, name, email FROM users WHERE email = ?',
      [email]
    );

    if (userRows.length === 0) {
      return null; // Email not found
    }

    const user = userRows[0];

    // Step 2: Fetch hashed password from credentials table
    const [credRows] = await db.query(
      'SELECT password FROM credentials WHERE uid = ?',
      [user.uid]
    );

    if (credRows.length === 0) {
      return null; // Credentials not found
    }

    const hashedPassword = credRows[0].password;

    // Step 3: Compare entered password with stored bcrypt hash
    const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
    if (!isMatch) {
      return null; // Password mismatch
    }

    // Step 4: Return user info on successful login
    return user;
  }
};
