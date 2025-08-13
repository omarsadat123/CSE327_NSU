/**
 * @file Dashboard data model for ProCollab
 * @module models/dashboard
 * @description Handles database operations for dashboard data
 */

const db = require('../configs/db');

module.exports = {
  /**
   * Gets user details by ID
   * @param {number} userId - User ID
   * @returns {object} User object with name
   */
  async getUserById(userId) {
    const [rows] = await db.query(
      'SELECT name FROM users WHERE uid = ?', 
      [userId]
    );
    return rows[0];
  },

  /**
   * Counts user's active projects
   * @param {number} userId - User ID
   * @returns {object} Counts of owned and joined projects
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
   * Counts user's pending tasks
   * @param {number} userId - User ID
   * @returns {number} Count of pending tasks
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
   * Gets projects owned by user
   * @param {number} userId - User ID
   * @returns {array} List of project objects (id, name)
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
   * Gets projects user has joined
   * @param {number} userId - User ID
   * @returns {array} List of project objects (id, name, owner)
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
   * Gets user's upcoming tasks
   * @param {number} userId - User ID
   * @returns {array} List of task objects (id, name, deadline, project)
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