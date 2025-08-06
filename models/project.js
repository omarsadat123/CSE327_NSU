const db = require('../configs/db');

class Project {
  static async create({ name, description, visibility, status, userId }) {
    const [result] = await db.execute(
      `INSERT INTO projects (name, description, visibility, status)
       VALUES (?, ?, ?, ?)`,
      [name, description, visibility, status]
    );

    const projectId = result.insertId;

    await db.execute(
      `INSERT INTO participates (uid, pid, role)
       VALUES (?, ?, 'Owner')`,
      [userId, projectId]
    );

    return projectId;
  }
}

module.exports = Project;
