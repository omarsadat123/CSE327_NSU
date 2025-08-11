// models/invitation.js
const db = require('../configs/db');

/**
 * Get all invitations for a given user ID where role = 'invited'.
 * Joins with projects and users to get project name + owner name.
 */
function getInvitationsByUserId(uid, callback) {
  const sql = `
    SELECT 
      p.pid,
      p.name AS project_name,
      u.name AS owner_name
    FROM participates AS part
    JOIN projects AS p ON part.pid = p.pid
    JOIN participates AS owner_part 
      ON owner_part.pid = p.pid AND owner_part.role = 'owner'
    JOIN users AS u ON owner_part.uid = u.uid
    WHERE part.uid = ? AND part.role = 'invited'
  `;

  db.query(sql, [uid], (err, results) => {
    if (err) return callback(err, null);
    callback(null, results);
  });
}

/**
 * Accept invitation — update role from 'invited' to 'member'
 */
function acceptInvitation(uid, pid, callback) {
  const sql = `
    UPDATE participates
    SET role = 'member'
    WHERE uid = ? AND pid = ? AND role = 'invited'
  `;

  db.query(sql, [uid, pid], (err, result) => {
    if (err) return callback(err, null);
    callback(null, result);
  });
}

/**
 * Reject invitation — delete row from participates table
 */
function rejectInvitation(uid, pid, callback) {
  const sql = `
    DELETE FROM participates
    WHERE uid = ? AND pid = ? AND role = 'invited'
  `;

  db.query(sql, [uid, pid], (err, result) => {
    if (err) return callback(err, null);
    callback(null, result);
  });
}

module.exports = {
  getInvitationsByUserId,
  acceptInvitation,
  rejectInvitation
};

