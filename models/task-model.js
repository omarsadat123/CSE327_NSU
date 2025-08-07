// models/taskModel.js
const pool = require('../configs/db');
/**
 * @file Manages all database operations related to tasks.
 * @author Omar Sadat
 */

/**
 * Represents a Task and its interactions with the database.
 * @class Task
 */

 // Method to get all tasks with associated project and user information
class Task {
  /**
   * Retrieves all tasks from the database with their associated project and user details.
   * @static
   * @async
   * @returns {Promise<Array<object>>} A promise that resolves to an array of task objects.
   */
  static async getAll() {
    const [rows] = await pool.query(
      `SELECT
        t.tid,
        t.name AS task_name,
        t.status,
        t.deadline,
        t.description AS task_description,
        t.priority,
        t.category,
        p.name AS project_name,
        p.pid,
        GROUP_CONCAT(u.name SEPARATOR ', ') AS assigned_user_names
      FROM tasks t
      LEFT JOIN projects p ON t.pid = p.pid
      LEFT JOIN assigned a ON t.tid = a.tid
      LEFT JOIN users u ON a.uid = u.uid
      GROUP BY t.tid
      ORDER BY t.tid DESC`
    );
    return rows;
  }


static async getByProjectId(pid) {
    const [rows] = await pool.query(
      `SELECT
        t.tid,
        t.name AS task_name,
        t.status,
        t.deadline,
        t.description AS task_description,
        t.priority,
        t.category,
        p.name AS project_name,
        p.pid,
        GROUP_CONCAT(u.name SEPARATOR ', ') AS assigned_user_names
      FROM tasks t
      LEFT JOIN projects p ON t.pid = p.pid
      LEFT JOIN assigned a ON t.tid = a.tid
      LEFT JOIN users u ON a.uid = u.uid
      WHERE t.pid = ?
      GROUP BY t.tid
      ORDER BY t.tid DESC`,
      [pid]
    );
    return rows;
  }


  /**
   * Creates a new task in the database.
   * @static
   * @async
   * @param {string} name - The name of the task.
   * @param {string} status - The current status of the task ('Pending', 'In Progress', 'Completed').
   * @param {string|null} deadline - The deadline for the task (YYYY-MM-DD).
   * @param {string} description - A detailed description of the task.
   * @param {string} priority - The priority level ('Low', 'Medium', 'High').
   * @param {string} category - The task category ('Development','Testing','Design').
   * @param {number} pid - The ID of the project this task belongs to.
   * @returns {Promise<object>} A promise that resolves to the database insertion result.
   */
  // Method to create a new task
  static async create(name, status, deadline, description, priority, category, pid) {
    const [result] = await pool.query(
      'INSERT INTO tasks (name, status, deadline, description, priority, category, pid) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, status, deadline, description, priority, category, pid]
    );
    return result;
  }
/**
 * Updates the status of a task by its ID.
 * @static
 * @async
 * @param {number} tid - The ID of the task to update.
 * @param {string} newStatus - The new status to set for the task.
 * @returns {Promise<Object>} The result of the database query.
 */
 

// Update a task's status by ID
static async updateStatus(tid, newStatus) {
  const [result] = await pool.query(
    'UPDATE tasks SET status = ? WHERE tid = ?',
    [newStatus, tid]
  );
  return result;
}



/**
 * Retrieves all participants (users) from the database.
 * @static
 * @async
 * @returns {Promise<Array<Object>>} An array of user objects containing their IDs and names.
 */
// Get all participants (users)
//static async getParticipants() {
  //const [rows] = await pool.query('SELECT uid, name FROM users');
 // return rows;
//}


/**
 * Assigns a user to a task by their IDs.
 * @static
 * @async
 * @param {number} uid - The ID of the user to assign.
 * @param {number} tid - The ID of the task to assign the user to.
 * @returns {Promise<Object>} The result of the database insertion.
 */
static async assignUser(uid, tid) {
  const [rows] = await pool.query('INSERT INTO assigned (uid, tid) VALUES (?, ?)', [uid, tid]);
  return rows;
}


static async getParticipantsByProject(pid) {
  const [rows] = await pool.query(
    `SELECT u.uid, u.name
     FROM users u
     JOIN participates pp ON u.uid = pp.uid
     WHERE pp.pid = ?`,
    [pid]
  );
  return rows;
}

static async getProjectNameById(pid) {
  const [rows] = await pool.query(
    'SELECT name FROM projects WHERE pid = ?',
    [pid]
  );
  return rows.length > 0 ? rows[0].name : null;
}

}

module.exports = Task;
