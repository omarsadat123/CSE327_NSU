/**
 * Users Model
 * Handles database operations related to users and their credentials.
 */

const db = require('../configs/db');

/**
 * Creates a new user in the 'users' table.
 * @param {string} name - Name of the user.
 * @param {string} email - Email of the user.
 * @returns {Promise<number>} The UID of the newly created user.
 */
async function createUser(name, email) {
    const query = `
        INSERT INTO users (name, email) 
        VALUES (?, ?)
    `;

    const [result] = await db.execute(query, [name, email]);
    return result.insertId;
}

/**
 * Stores the hashed password for a given user UID.
 * @param {number} uid - The unique identifier of the user.
 * @param {string} passwordHash - The hashed password.
 * @returns {Promise<void>}
 */
async function storePassword(uid, passwordHash) {
    const query = `
        INSERT INTO credentials (uid, password) 
        VALUES (?, ?)
    `;

    await db.execute(query, [uid, passwordHash]);
}

module.exports = {createUser,storePassword};