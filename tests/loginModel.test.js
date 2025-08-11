/**
 * @fileoverview Unit tests for the login model's getUserWithCredentials function.
 * Verifies database query behavior and return values for existing and non-existing users.
 */

const { getUserWithCredentials } = require('../models/login.model');
const db = require('../configs/db');

// Mock database module before running tests
jest.mock('../configs/db', () => ({
  query: jest.fn()
}));

describe('Login Model - getUserWithCredentials', () => {
  /**
   * Tests that a valid email returns the correct user object.
   * The mocked database query resolves to a user row.
   */
  it('should return a user when email exists', async () => {
    const mockUser = {
      uid: 1,
      name: 'Test User',
      email: 'test@example.com',
      password: 'hashedpassword123'
    };

    // Mock DB response
    db.query.mockResolvedValue([[mockUser]]);

    // Execute model function
    const result = await getUserWithCredentials('test@example.com');

    // Assertions
    expect(result).toEqual(mockUser);
    expect(db.query).toHaveBeenCalledWith(expect.any(String), ['test@example.com']);
  });

  /**
   * Tests that a non-existing email returns undefined.
   * The mocked database query resolves to an empty array.
   */
  it('should return undefined when email does not exist', async () => {
    // Mock DB response as empty
    db.query.mockResolvedValue([[]]);

    // Execute model function
    const result = await getUserWithCredentials('notfound@example.com');

    // Assertions
    expect(result).toBeUndefined();
  });
});

