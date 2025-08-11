/**
 * @file Dashboard data model for ProCollab.
 * @module models/dashboard
 * @description Provides methods for fetching dashboard-related data (projects, tasks, user stats).
 */

const db = require('../configs/db');

module.exports = {
  /**
   * Fetches a user's basic details by ID.
   * @async
   * @param {number} userId - The user's unique ID.
   * @returns {Promise<{name: string}>} Object containing the user's name.
   * @throws {Error} If database query fails.
   * @example
   * const user = await dashboard.getUserById(123);
   * console.log(user.name); // "John Doe"
   */
  async getUserById(userId) {
    const [rows] = await db.query('SELECT name FROM users WHERE uid = ?', [userId]);
    return rows[0];
  },

  /**
   * Counts active projects owned/joined by a user.
   * @async
   * @param {number} userId - The user's unique ID.
   * @returns {Promise<{owned: number, joined: number}>} Counts of owned/joined active projects.
   * @throws {Error} If database query fails.
   */
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

  /**
   * Counts pending tasks assigned to a user.
   * @async
   * @param {number} userId - The user's unique ID.
   * @returns {Promise<number>} Count of pending tasks.
   * @throws {Error} If database query fails.
   */
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

  /**
   * Lists projects owned by a user.
   * @async
   * @param {number} userId - The user's unique ID.
   * @returns {Promise<Array<{pid: number, name: string}>>} Array of project objects.
   * @throws {Error} If database query fails.
   */
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

  /**
   * Lists projects joined by a user (with owner names).
   * @async
   * @param {number} userId - The user's unique ID.
   * @returns {Promise<Array<{pid: number, name: string, owner_name: string}>>} Array of project objects.
   * @throws {Error} If database query fails.
   */
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

  /**
   * Lists upcoming tasks assigned to a user (sorted by deadline).
   * @async
   * @param {number} userId - The user's unique ID.
   * @returns {Promise<Array<{tid: number, task_name: string, deadline: string, project_name: string, pid: number}>>} Array of task objects.
   * @throws {Error} If database query fails.
   */
  async getUpcomingTasks(userId) {
    const [rows] = await db.execute(
      `SELECT t.tid, t.name AS task_name, t.deadline,
              p.name AS project_name, p.pid
       FROM tasks t
       JOIN projects p ON t.pid = p.pid
       JOIN assigned a ON t.tid = a.tid
       WHERE a.uid = ? AND t.status != 'done'
       ORDER BY t.deadline ASC
       LIMIT 8`,
      [userId]
    );
    return rows;
  }
};