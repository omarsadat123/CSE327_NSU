const db = require('../configs/db');

/**
 * Finds a user by their email address.
 * @async
 * @param {string} email - The user's email address.
 * @returns {Promise<[Array, Array]>} Promise resolving to a tuple where the first element is the results array and second is metadata.
 * @throws {Error} If the database query fails.
 * @example
 * const [results] = await findUserByEmail('user@example.com');
 * if (results.length) {
 *   console.log('User ID:', results[0].uid);
 * }
 */
exports.findUserByEmail = (email) => {
  return db.query('SELECT uid FROM users WHERE email = ?', [email]);
};

/**
 * Updates the password hash for a given user ID.
 * @async
 * @param {number} uid - The unique user ID.
 * @param {string} hashedPassword - The bcrypt hashed password string.
 * @returns {Promise<[Object, Array]>} Promise resolving to the result of the update query.
 * @throws {Error} If the database query fails.
 * @example
 * await updatePassword(123, '$2a$12$hash...');
 */
exports.updatePassword = (uid, hashedPassword) => {
  return db.query('UPDATE credentials SET password = ? WHERE uid = ?', [hashedPassword, uid]);
};
