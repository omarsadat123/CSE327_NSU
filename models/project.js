/**
 * @file Project model for ProCollab
 * @module models/project
 * @description Handles project database operations
 */

const db = require('../configs/db');

/**
 * Handles project-related database operations
 */
class Project {
  /**
   * Creates a new project and assigns owner
   * @param {object} params - Project details
   * @param {string} params.name - Project name (required)
   * @param {string} [params.description=""] - Project description
   * @param {string} params.visibility - 'public' or 'private'
   * @param {string} [params.status="active"] - Initial status
   * @param {number} params.userId - Creator's user ID
   * @returns {number} New project ID
   */
  static async create({ name, description = '', visibility, status = 'active', userId }) {
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