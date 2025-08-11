/**
 * Login Model
 * Handles retrieval of user credentials from the database.
 */


const db = require('../configs/db');

/**
 * Retrieves a user and their password hash by email.
 * @param {string} email - The email of the user.
 * @returns {Promise<Object|undefined>} User object if found, otherwise undefined.
 */
async function getUserWithCredentials(email) {
    const query = `
        SELECT 
            u.uid, 
            u.name, 
            u.email, 
            c.password
        FROM 
            users u
        JOIN 
            credentials c 
        ON 
            u.uid = c.uid
        WHERE 
            u.email = ?
    `;

    const [rows] = await db.query(query, [email]);
    return rows[0]; // Return user object or undefined
}

module.exports = {getUserWithCredentials};
