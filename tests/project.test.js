const db = require('../configs/db');
const Project = require('../models/project');

jest.mock('../configs/db');

describe('Project Model - create()', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a project and assign user as owner', async () => {
    const fakeProjectId = 123;

    db.execute
      .mockResolvedValueOnce([{ insertId: fakeProjectId }]) // insert into projects
      .mockResolvedValueOnce([{}]);                         // insert into participates

    const newProject = {
      name: 'Test Project',
      description: 'A sample test project',
      visibility: 'Public',
      status: 'Active',
      userId: 1
    };

    const result = await Project.create(newProject);

    expect(db.execute).toHaveBeenCalledWith(
      `INSERT INTO projects (name, description, visibility, status)
       VALUES (?, ?, ?, ?)`,
      ['Test Project', 'A sample test project', 'Public', 'Active']
    );

    expect(db.execute).toHaveBeenCalledWith(
      `INSERT INTO participates (uid, pid, role)
       VALUES (?, ?, 'Owner')`,
      [1, fakeProjectId]
    );

    expect(result).toBe(fakeProjectId);
  });
});
