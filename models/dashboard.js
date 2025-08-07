const db = require('../configs/db'); // DB connection

module.exports = {
  async getUserById(userId) {
    const [rows] = await db.query(
      'SELECT name FROM users WHERE uid = ?',
      [userId]
    );
    return rows[0];
  },

  async getActiveProjectCounts(userId) {
    const [[owned]] = await db.query(
      `SELECT COUNT(*) AS count
       FROM projects p
       JOIN participates pa ON p.pid = pa.pid
       WHERE pa.uid = ? AND pa.role = 'Owner'
       AND p.status = 'active'`,
      [userId]
    );

    const [[joined]] = await db.query(
      `SELECT COUNT(*) AS count
       FROM projects p
       JOIN participates pa ON p.pid = pa.pid
       WHERE pa.uid = ? AND pa.role = 'Member'
       AND p.status = 'active'`,
      [userId]
    );

    return { owned: owned.count, joined: joined.count };
  },

  async getPendingTasksCount(userId) {
    const [[count]] = await db.query(
      `SELECT COUNT(*) AS count
       FROM tasks t
       JOIN assigned a ON t.tid = a.tid
       WHERE a.uid = ? AND t.status != 'done'`,
      [userId]
    );
    return count.count;
  },

  async getOwnedProjects(userId) {
    const [rows] = await db.query(
      `SELECT p.pid, p.name
       FROM projects p
       JOIN participates pa ON p.pid = pa.pid
       WHERE pa.uid = ? AND pa.role = 'Owner'
       ORDER BY p.pid DESC`,
      [userId]
    );
    return rows;
  },

  async getJoinedProjects(userId) {
    const [rows] = await db.query(
      `SELECT p.pid, p.name, u.name AS owner_name
       FROM projects p
       JOIN participates pa ON p.pid = pa.pid
       JOIN participates po ON p.pid = po.pid AND po.role = 'Owner'
       JOIN users u ON po.uid = u.uid
       WHERE pa.uid = ? AND pa.role = 'Member'
       ORDER BY p.pid DESC`,
      [userId]
    );
    return rows;
  },

  async getUpcomingTasks(userId) {
    const [rows] = await db.execute(
      `SELECT t.tid, t.name AS task_name, t.deadline,
              p.name AS project_name, p.pid
       FROM tasks t
       JOIN projects p ON t.pid = p.pid
       JOIN assigned a ON t.tid = a.tid
       WHERE a.uid = ?
         AND t.status != 'done'
       ORDER BY t.deadline ASC
       LIMIT 8`,
      [userId]
    );
    return rows;
  }
};
