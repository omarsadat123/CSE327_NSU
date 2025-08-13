// models/taskModel.js
const pool = require('../configs/db');

 // Method to get all tasks with associated project and user information
class Task {

  /**
 * Retrieves all tasks with their associated project details and assigned user names.
 *
 * Executes a SQL query joining the `tasks`, `projects`, `assigned`, and `users` tables.
 * Each task includes its project name and a comma-separated list of assigned user names.
 * Results are ordered by task ID in descending order.
 *
 * @async
 * @function getAll
 * @static
 * @returns {Promise<Object[]>} A promise that resolves to an array of task objects.
 * @returns {number} return[].tid - The ID of the task.
 * @returns {string} return[].task_name - The name/title of the task.
 * @returns {string} return[].status - The current status of the task.
 * @returns {string|null} return[].deadline - The deadline date of the task (if any).
 * @returns {string} return[].task_description - The description of the task.
 * @returns {string} return[].priority - The priority level of the task.
 * @returns {string} return[].category - The category/type of the task.
 * @returns {string} return[].project_name - The name of the associated project.
 * @returns {number} return[].pid - The ID of the project.
 * @returns {string|null} return[].assigned_user_names - Comma-separated list of assigned user names (if any).
 *
 * @example
 * const tasks = await Task.getAll();
 * console.log(tasks);
 * // [
 * //   {
 * //     tid: 1,
 * //     task_name: 'Design Homepage',
 * //     status: 'open',
 * //     deadline: '2025-08-20',
 * //     task_description: 'Create initial homepage wireframe',
 * //     priority: 'high',
 * //     category: 'UI/UX',
 * //     project_name: 'Website Redesign',
 * //     pid: 2,
 * //     assigned_user_names: 'Alice, Bob'
 * //   },
 * //   ...
 * // ]
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


/**
 * Retrieves all tasks for a specific project, including project details and assigned user names.
 *
 * Executes a SQL query joining the `tasks`, `projects`, `assigned`, and `users` tables,
 * filtered by the given project ID. Each task includes the project name and a comma-separated
 * list of assigned user names. Results are ordered by task ID in descending order.
 *
 * @async
 * @function getByProjectId
 * @static
 * @param {string|number} pid - The ID of the project to retrieve tasks for.
 * @returns {Promise<Object[]>} A promise that resolves to an array of task objects.
 * @returns {number} return[].tid - The ID of the task.
 * @returns {string} return[].task_name - The name/title of the task.
 * @returns {string} return[].status - The current status of the task.
 * @returns {string|null} return[].deadline - The deadline date of the task (if any).
 * @returns {string} return[].task_description - The description of the task.
 * @returns {string} return[].priority - The priority level of the task.
 * @returns {string} return[].category - The category/type of the task.
 * @returns {string} return[].project_name - The name of the associated project.
 * @returns {number} return[].pid - The ID of the project.
 * @returns {string|null} return[].assigned_user_names - Comma-separated list of assigned user names (if any).
 *
 * @example
 * const tasks = await Task.getByProjectId(5);
 * console.log(tasks);
 * // [
 * //   {
 * //     tid: 12,
 * //     task_name: 'Backend API Development',
 * //     status: 'in-progress',
 * //     deadline: '2025-08-25',
 * //     task_description: 'Build the REST API endpoints for the project',
 * //     priority: 'medium',
 * //     category: 'backend',
 * //     project_name: 'Mobile App',
 * //     pid: 5,
 * //     assigned_user_names: 'Alice, Bob'
 * //   },
 * //   ...
 * // ]
 */

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
 *
 * Inserts a record into the `tasks` table with the specified details.
 *
 * @async
 * @function create
 * @static
 * @param {string} name - The name/title of the task.
 * @param {string} status - The current status of the task (e.g., 'pending', 'in-progress', 'completed').
 * @param {string|null} deadline - The deadline date for the task in 'YYYY-MM-DD' format, or null if no deadline.
 * @param {string} description - A detailed description of the task.
 * @param {string} priority - The priority level of the task (e.g., 'low', 'medium', 'high').
 * @param {string} category - The category or type of the task (e.g., 'frontend', 'backend', 'design').
 * @param {number} pid - The project ID this task belongs to.
 * @returns {Promise<Object>} A promise that resolves to the database result object.
 * @returns {number} return.insertId - The ID of the newly inserted task.
 * @returns {number} return.affectedRows - The number of affected rows (should be 1 if successful).
 *
 * @example
 * const result = await Task.create(
 *   'Design Homepage',
 *   'pending',
 *   '2025-08-30',
 *   'Create wireframe and mockups for homepage',
 *   'high',
 *   'design',
 *   3
 * );
 * console.log(result.insertId); // e.g., 42
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
 *
 * @async
 * @function updateStatus
 * @static
 * @param {number} tid - The unique ID of the task to update.
 * @param {string} newStatus - The new status for the task (e.g., 'pending', 'in-progress', 'completed').
 * @returns {Promise<Object>} A promise resolving to the database result object.
 * @returns {number} return.affectedRows - The number of rows affected (should be 1 if successful).
 *
 * @example
 * await Task.updateStatus(12, 'completed');
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
 * Assigns a user to a task.
 *
 * Inserts a record into the `assigned` table linking a user to a task.
 *
 * @async
 * @function assignUser
 * @static
 * @param {number} uid - The unique ID of the user to assign.
 * @param {number} tid - The unique ID of the task.
 * @returns {Promise<Object>} A promise resolving to the database result object.
 *
 * @example
 * await Task.assignUser(5, 12);
 */



static async assignUser(uid, tid) {
  const [rows] = await pool.query('INSERT INTO assigned (uid, tid) VALUES (?, ?)', [uid, tid]);
  return rows;
}

/**
 * Retrieves all participants of a specific project.
 *
 * Joins the `users` table with the `participates` table to find all users
 * associated with the given project ID.
 *
 * @async
 * @function getParticipantsByProject
 * @static
 * @param {number} pid - The project ID.
 * @returns {Promise<Array<{uid: number, name: string}>>} A promise resolving to an array of participants.
 *
 * @example
 * const participants = await Task.getParticipantsByProject(3);
 * // [{ uid: 1, name: 'Alice' }, { uid: 2, name: 'Bob' }]
 */
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

/**
 * Retrieves the name of a project by its ID.
 *
 * @async
 * @function getProjectNameById
 * @static
 * @param {number} pid - The project ID.
 * @returns {Promise<string|null>} A promise resolving to the project name, or null if not found.
 *
 * @example
 * const projectName = await Task.getProjectNameById(2);
 * // "Website Redesign"
 */


static async getProjectNameById(pid) {
  const [rows] = await pool.query(
    'SELECT name FROM projects WHERE pid = ?',
    [pid]
  );
  return rows.length > 0 ? rows[0].name : null;
}

}

module.exports = Task;
