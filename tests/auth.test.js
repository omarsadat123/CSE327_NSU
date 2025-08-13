
const bcrypt = require('bcryptjs');

// Mock DB config to avoid actual database calls
jest.mock('../configs/db', () => ({
  query: jest.fn(),
  getConnection: jest.fn(),
}));

const db = require('../configs/db');
const auth = require('../models/auth');

describe('Authentication Model', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ---------------------------
  // findUserByEmail
  // ---------------------------
  test('returns user when email exists', async () => {
    db.query.mockResolvedValueOnce([[{ uid: 1, name: 'Alice', email: 'alice@example.com' }], []]);

    const user = await auth.findUserByEmail('alice@example.com');

    expect(user).toEqual({ uid: 1, name: 'Alice', email: 'alice@example.com' });
    expect(db.query).toHaveBeenCalledWith(
      'SELECT uid, name, email FROM users WHERE email = ?',
      ['alice@example.com']
    );
  });

  test('returns null when email does not exist', async () => {
    db.query.mockResolvedValueOnce([[], []]);

    const user = await auth.findUserByEmail('noone@example.com');

    expect(user).toBeNull();
  });

  // ---------------------------
  // findUserByEmailAndPassword
  // ---------------------------
  test('returns user when password matches', async () => {
    db.query
      .mockResolvedValueOnce([[{ uid: 2, name: 'Bob', email: 'bob@example.com' }], []])
      .mockResolvedValueOnce([[{ password: 'hashed_pw' }], []]);
    jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(true);

    const user = await auth.findUserByEmailAndPassword('bob@example.com', 'plainpass');

    expect(user).toEqual({ uid: 2, name: 'Bob', email: 'bob@example.com' });
    expect(bcrypt.compare).toHaveBeenCalledWith('plainpass', 'hashed_pw');
  });

  test('returns null when password does not match', async () => {
    db.query
      .mockResolvedValueOnce([[{ uid: 3, name: 'Carl', email: 'carl@example.com' }], []])
      .mockResolvedValueOnce([[{ password: 'hashed_pw' }], []]);
    jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(false);

    const user = await auth.findUserByEmailAndPassword('carl@example.com', 'wrongpass');

    expect(user).toBeNull();
  });

  // ---------------------------
  // createUserWithCredentials
  // ---------------------------
  test('inserts user and credentials successfully', async () => {
    const conn = {
      beginTransaction: jest.fn().mockResolvedValue(),
      query: jest
        .fn()
        .mockResolvedValueOnce([{ insertId: 99 }])
        .mockResolvedValueOnce([{ affectedRows: 1 }]),
      commit: jest.fn().mockResolvedValue(),
      rollback: jest.fn().mockResolvedValue(),
      release: jest.fn(),
    };
    db.getConnection.mockResolvedValueOnce(conn);

    const result = await auth.createUserWithCredentials('Daisy', 'daisy@example.com', 'hashedpass');

    expect(result).toEqual({ uid: 99, name: 'Daisy', email: 'daisy@example.com' });
    expect(conn.beginTransaction).toHaveBeenCalled();
    expect(conn.query).toHaveBeenCalledTimes(2);
    expect(conn.commit).toHaveBeenCalled();
    expect(conn.release).toHaveBeenCalled();
  });

  test('rolls back and throws error on failure', async () => {
    const conn = {
      beginTransaction: jest.fn().mockResolvedValue(),
      query: jest.fn().mockRejectedValue(new Error('insert fail')),
      commit: jest.fn(),
      rollback: jest.fn().mockResolvedValue(),
      release: jest.fn(),
    };
    db.getConnection.mockResolvedValueOnce(conn);

    await expect(
      auth.createUserWithCredentials('Err', 'err@example.com', 'h')
    ).rejects.toThrow('insert fail');

    expect(conn.rollback).toHaveBeenCalled();
    expect(conn.release).toHaveBeenCalled();
  });
});
