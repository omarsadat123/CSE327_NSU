/**
 * @file Project model for ProCollab.
 * @module models/project
 * @description Handles project creation and database interactions.
 */

const db = require('../configs/db');

/**
 * Represents a Project in the system.
 * @class
 */
class Project {
  /**
   * Creates a new project and assigns the creator as Owner.
   * @static
   * @async
   * @param {Object} params - Project creation parameters.
   * @param {string} params.name - Project name.
   * @param {string} [params.description=""] - Project description.
   * @param {string} params.visibility - Either 'public' or 'private'.
   * @param {string} [params.status="active"] - Project status (e.g., 'active', 'archived').
   * @param {number} params.userId - ID of the user creating the project.
   * @returns {Promise<number>} ID of the newly created project.
   * @throws {Error} If database query fails.
   * @example
   * const projectId = await Project.create({
   *   name: "New Project",
   *   visibility: "private",
   *   userId: 123
   * });
   */
  static async create({ name, description = "", visibility, status = "active", userId }) {
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