// models/taskModel.js
const pool = require('../configs/db');

 // Method to get all tasks with associated project and user information
class Task {
 
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


  // Method to create a new task
  static async create(name, status, deadline, description, priority, category, pid) {
    const [result] = await pool.query(
      'INSERT INTO tasks (name, status, deadline, description, priority, category, pid) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, status, deadline, description, priority, category, pid]
    );
    return result;
  }


// Update a task's status by ID
static async updateStatus(tid, newStatus) {
  const [result] = await pool.query(
    'UPDATE tasks SET status = ? WHERE tid = ?',
    [newStatus, tid]
  );
  return result;
}






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
