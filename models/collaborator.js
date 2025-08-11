const db = require('../configs/db');

module.exports = {
  async findUserByEmail(email) {
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
  },

  async isUserInProject(uid, pid) {
    const [rows] = await db.query(
      'SELECT * FROM participates WHERE uid = ? AND pid = ?',
      [uid, pid]
    );
    return rows.length > 0;
  },

  async addCollaboratorToProject(uid, pid) {
    await db.execute(
      'INSERT INTO participates (uid, pid, role) VALUES (?, ?, ?)',
      [uid, pid, 'invited']
    );
  },

  async getProjectNameById(pid) {
    const [rows] = await db.query('SELECT name FROM projects WHERE pid = ?', [pid]);
    return rows[0]?.name || null;
  },

  async getUserNameById(uid) {
    const [rows] = await db.query('SELECT name FROM users WHERE uid = ?', [uid]);
    return rows[0]?.name || null;
  }
};
