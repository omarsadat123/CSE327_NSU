/**
 * @fileoverview Unit tests for the authentication model (`auth.js`).
 * 
 * These tests verify that the authentication model's database queries
 * and password handling logic behave correctly.
 * 
 * Uses Jest mocking to isolate database operations and bcrypt comparisons.
 */

const bcrypt = require('bcryptjs');

/**
 * Mock implementation for the database configuration module.
 * 
 * The mock provides:
 * - `query` for executing SQL queries
 * - `getConnection` for acquiring database connections
 */
jest.mock('../configs/db', () => ({
  query: jest.fn(),
  getConnection: jest.fn(),
}));

// Import the mocked DB
const db = require('../configs/db');

// Import the module under test
const auth = require('../models/auth');

describe('Authentication Model Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /**
   * @test Ensures `findUserByEmail` returns a user when found.
   */
  test('findUserByEmail returns user when found', async () => {
    db.query.mockResolvedValueOnce([[{ uid: 1, name: 'Alice', email: 'alice@example.com' }], []]);

    const user = await auth.findUserByEmail('alice@example.com');
    expect(user).toEqual({ uid: 1, name: 'Alice', email: 'alice@example.com' });
    expect(db.query).toHaveBeenCalledWith(
      'SELECT uid, name, email FROM users WHERE email = ?',
      ['alice@example.com']
    );
  });

  /**
   * @test Ensures `findUserByEmail` returns `null` when no user is found.
   */
  test('findUserByEmail returns null when not found', async () => {
    db.query.mockResolvedValueOnce([[], []]);

    const user = await auth.findUserByEmail('noone@example.com');
    expect(user).toBeNull();
  });

  /**
   * @test Ensures `findUserByEmailAndPassword` returns a user when password matches.
   */
  test('findUserByEmailAndPassword returns user when password matches', async () => {
    db.query
      .mockResolvedValueOnce([[{ uid: 2, name: 'Bob', email: 'bob@example.com' }], []])
      .mockResolvedValueOnce([[{ password: 'hashed_pw' }], []]);

    jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(true);

    const user = await auth.findUserByEmailAndPassword('bob@example.com', 'plainpass');
    expect(user).toEqual({ uid: 2, name: 'Bob', email: 'bob@example.com' });
    expect(bcrypt.compare).toHaveBeenCalledWith('plainpass', 'hashed_pw');
  });

  /**
   * @test Ensures `findUserByEmailAndPassword` returns `null` when password does not match.
   */
  test('findUserByEmailAndPassword returns null when password does not match', async () => {
    db.query
      .mockResolvedValueOnce([[{ uid: 3, name: 'Carl', email: 'carl@example.com' }], []])
      .mockResolvedValueOnce([[{ password: 'hashed_pw' }], []]);

    jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(false);

    const user = await auth.findUserByEmailAndPassword('carl@example.com', 'wrongpass');
    expect(user).toBeNull();
  });

  /**
   * @test Ensures `createUserWithCredentials` inserts user and credentials successfully.
   */
  test('createUserWithCredentials inserts user and credentials', async () => {
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

  /**
   * @test Ensures `createUserWithCredentials` rolls back on error.
   */
  test('createUserWithCredentials rolls back on error', async () => {
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
