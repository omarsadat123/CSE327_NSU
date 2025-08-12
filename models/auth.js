const db = require('../configs/db');
const bcrypt = require('bcryptjs');

module.exports = {
  async findUserByEmail(email) {
    const [rows] = await db.query('SELECT uid, name, email FROM users WHERE email = ?', [email]);
    return rows.length ? rows[0] : null;
  },

  async findUserByEmailAndPassword(email, plainPassword) {
    const [userRows] = await db.query('SELECT uid, name, email FROM users WHERE email = ?', [email]);
    if (userRows.length === 0) return null;

    const user = userRows[0];

    const [credRows] = await db.query('SELECT password FROM credentials WHERE uid = ?', [user.uid]);
    if (credRows.length === 0) return null;

    const hashedPassword = credRows[0].password;
    const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
    if (!isMatch) return null;

    return user;
  },

  async createUserWithCredentials(name, email, hashedPassword) {
    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();

      const [userResult] = await conn.query('INSERT INTO users (name, email) VALUES (?, ?)', [name, email]);
      const uid = userResult.insertId;

      await conn.query('INSERT INTO credentials (uid, password) VALUES (?, ?)', [uid, hashedPassword]);

      await conn.commit();

      return { uid, name, email };
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  },
};
