const dashboardModel = require('../models/dashboard');
const db = require('../configs/db');

jest.mock('../configs/db', () => ({
  query: jest.fn(),
  execute: jest.fn()
}));

describe('dashboardModel', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getUserById', () => {
    it('should return user name for given userId', async () => {
      const mockUser = { name: 'Alice' };
      db.query.mockResolvedValueOnce([[mockUser]]);

      const result = await dashboardModel.getUserById(1);

      expect(db.query).toHaveBeenCalledWith(
        'SELECT name FROM users WHERE uid = ?',
        [1]
      );
      expect(result).toEqual(mockUser);
    });
  });

  describe('getActiveProjectCounts', () => {
    it('should return counts of owned and joined active projects', async () => {
      const mockOwned = { count: 5 };
      const mockJoined = { count: 3 };

      db.query.mockResolvedValueOnce([[mockOwned]]);
      db.query.mockResolvedValueOnce([[mockJoined]]);

      const result =
        await dashboardModel.getActiveProjectCounts(1);

      expect(db.query).toHaveBeenNthCalledWith(
        1,
        expect.stringContaining('COUNT(*) AS count'),
        [1]
      );

      expect(db.query).toHaveBeenNthCalledWith(
        2,
        expect.stringContaining('COUNT(*) AS count'),
        [1]
      );

      expect(result).toEqual({ owned: 5, joined: 3 });
    });
  });

  describe('getPendingTasksCount', () => {
    it('should return count of pending tasks for user', async () => {
      const mockCount = { count: 7 };
      db.query.mockResolvedValueOnce([[mockCount]]);

      const result =
        await dashboardModel.getPendingTasksCount(1);

      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining('COUNT(*) AS count'),
        [1]
      );
      expect(result).toBe(7);
    });
  });

  describe('getOwnedProjects', () => {
    it('should return list of owned projects', async () => {
      const mockProjects = [
        { pid: 1, name: 'Project 1' },
        { pid: 2, name: 'Project 2' }
      ];

      db.query.mockResolvedValueOnce([mockProjects]);

      const result =
        await dashboardModel.getOwnedProjects(1);

      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining('FROM projects p'),
        [1]
      );
      expect(result).toEqual(mockProjects);
    });
  });

  describe('getJoinedProjects', () => {
    it('should return list of joined projects with owner name', async () => {
      const mockProjects = [
        { pid: 3, name: 'Project 3', owner_name: 'Bob' },
        { pid: 4, name: 'Project 4', owner_name: 'Carol' }
      ];

      db.query.mockResolvedValueOnce([mockProjects]);

      const result =
        await dashboardModel.getJoinedProjects(1);

      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining('JOIN users u'),
        [1]
      );
      expect(result).toEqual(mockProjects);
    });
  });

  describe('getUpcomingTasks', () => {
    it('should return list of upcoming tasks limited to 8', async () => {
      const mockTasks = [
        {
          tid: 10,
          task_name: 'Task A',
          deadline: '2025-08-10',
          project_name: 'Project X',
          pid: 5
        },
        {
          tid: 11,
          task_name: 'Task B',
          deadline: '2025-08-15',
          project_name: 'Project Y',
          pid: 6
        }
      ];

      db.execute.mockResolvedValueOnce([mockTasks]);

      const result =
        await dashboardModel.getUpcomingTasks(1);

      expect(db.execute).toHaveBeenCalledWith(
        expect.stringContaining('LIMIT 8'),
        [1]
      );
      expect(result).toEqual(mockTasks);
    });
  });
});
