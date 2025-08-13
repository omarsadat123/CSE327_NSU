/**
 * @file Password reset database model for ProCollab
 * @module models/password-reset
 * @description Handles DB queries for password reset: finding users and updating passwords
 */

const db = require('../configs/db');

/**
 * Find a user by email.
 *
 * @async
 * @param {string} email - User's email
 * @returns {Promise} Resolves to [results, metadata]
 */
const findUserByEmail = (email) => {
  return db.query('SELECT uid FROM users WHERE email = ?', [email]);
};

/**
 * Update password for a user.
 *
 * @async
 * @param {number} uid - User ID
 * @param {string} hashedPassword - Hashed password
 * @returns {Promise} Resolves to [result, metadata]
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
