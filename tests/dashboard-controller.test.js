const dashboardController = require('../controllers/dashboard-controller');
const Dashboard = require('../models/dashboard');

jest.mock('../models/dashboard');

describe('Dashboard Controller - getDashboard', () => {
  let req;
  let res;

  beforeEach(() => {
    req = {
      session: { userId: 1 }
    };

    res = {
      render: jest.fn(),
      status: jest.fn(() => res),
      send: jest.fn()
    };
  });

  it('should render dashboard with correct data on success', async () => {
    Dashboard.getUserById.mockResolvedValue({ name: 'Test User' });
    Dashboard.getActiveProjectCounts.mockResolvedValue({
      owned: 2,
      joined: 3
    });
    Dashboard.getPendingTasksCount.mockResolvedValue(5);
    Dashboard.getOwnedProjects.mockResolvedValue([
      { pid: 1, name: 'Project 1' }
    ]);
    Dashboard.getJoinedProjects.mockResolvedValue([
      {
        pid: 2,
        name: 'Project 2',
        owner_name: 'Owner 1'
      }
    ]);
    Dashboard.getUpcomingTasks.mockResolvedValue([
      {
        tid: 10,
        task_name: 'Task 1',
        deadline: '2025-08-15',
        project_name: 'Project 1',
        pid: 1
      }
    ]);

    await dashboardController.getDashboard(req, res);

    expect(Dashboard.getUserById).toHaveBeenCalledWith(1);
    expect(Dashboard.getActiveProjectCounts).toHaveBeenCalledWith(1);
    expect(Dashboard.getPendingTasksCount).toHaveBeenCalledWith(1);
    expect(Dashboard.getOwnedProjects).toHaveBeenCalledWith(1);
    expect(Dashboard.getJoinedProjects).toHaveBeenCalledWith(1);
    expect(Dashboard.getUpcomingTasks).toHaveBeenCalledWith(1);

    expect(res.render).toHaveBeenCalledWith('dashboard', {
      user: { name: 'Test User' },
      projectCounts: { owned: 2, joined: 3 },
      pendingTasksCount: 5,
      ownedProjects: [
        { pid: 1, name: 'Project 1' }
      ],
      joinedProjects: [
        {
          pid: 2,
          name: 'Project 2',
          owner_name: 'Owner 1'
        }
      ],
      upcomingTasks: [
        {
          tid: 10,
          task_name: 'Task 1',
          deadline: '2025-08-15',
          project_name: 'Project 1',
          pid: 1
        }
      ]
    });
  });

  it('should send 500 if an error occurs', async () => {
    Dashboard.getUserById.mockRejectedValue(new Error('DB Error'));

    await dashboardController.getDashboard(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith('Server Error');
  });
});
