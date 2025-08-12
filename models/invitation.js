// models/invitation.js
const db = require('../configs/db');

/**
 * Get all invitations for a given user ID where role = 'invited'.
 */
async function getInvitationsByUserId(uid) {
  const sql = `
    SELECT 
      p.pid,
      p.name AS project_name,
      u.name AS owner_name
    FROM participates AS part
    JOIN projects AS p ON part.pid = p.pid
    JOIN participates AS owner_part 
      ON owner_part.pid = p.pid AND owner_part.role = 'Owner'
    JOIN users AS u ON owner_part.uid = u.uid
    WHERE part.uid = ? AND part.role = 'invited'
  `;

  const [results] = await db.query(sql, [uid]);
  return results;
}

/**
 * Accept invitation — update role from 'invited' to 'member'
 */
async function acceptInvitation(uid, pid) {
  const sql = `
    UPDATE participates
    SET role = 'member'
    WHERE uid = ? AND pid = ? AND role = 'invited'
  `;

  const [result] = await db.query(sql, [uid, pid]);
  return result;
}

/**
 * Reject invitation — delete row from participates table
 */
async function rejectInvitation(uid, pid) {
  const sql = `
    DELETE FROM participates
    WHERE uid = ? AND pid = ? AND role = 'invited'
  `;

  const [result] = await db.query(sql, [uid, pid]);
  return result;
}

module.exports = {
  getInvitationsByUserId,
  acceptInvitation,
  rejectInvitation,
};
