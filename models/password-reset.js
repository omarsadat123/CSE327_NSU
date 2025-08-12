/**
 * @file Password reset database model for ProCollab.
 * @module models/password-reset
 * @description Handles database queries related to password reset, including user lookup and password updates.
 */

const db = require('../configs/db');

/**
 * Finds a user by their email address.
 *
 * @async
 * @function findUserByEmail
 * @param {string} email - The user's email address.
 * @returns {Promise<[Array, Array]>} Promise resolving to a tuple: first element is result rows, second is metadata.
 * @throws {Error} If the database query fails.
 * @example
 * const [results] = await findUserByEmail('user@example.com');
 * if (results.length) console.log(results[0].uid);
 */
const findUserByEmail = (email) => {
  return db.query('SELECT uid FROM users WHERE email = ?', [email]);
};

/**
 * Updates the password hash for a specific user ID.
 *
 * @async
 * @function updatePassword
 * @param {number} uid - Unique user ID.
 * @param {string} hashedPassword - The bcrypt hashed password.
 * @returns {Promise<[Object, Array]>} Promise resolving to the update query result and metadata.
 * @throws {Error} If the database query fails.
 * @example
 * await updatePassword(123, '$2a$12$hash...');
 */
const updatePassword = (uid, hashedPassword) => {
  return db.query(
    'UPDATE credentials SET password = ? WHERE uid = ?',
    [hashedPassword, uid]
  );
};

module.exports = {
  findUserByEmail,
  updatePassword
};
