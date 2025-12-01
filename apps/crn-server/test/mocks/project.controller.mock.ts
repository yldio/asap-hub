import ProjectController from '../../src/controllers/project.controller';

export const projectControllerMock = {
  fetch: jest.fn(),
  fetchById: jest.fn(),
  fetchByTeamId: jest.fn(),
  fetchByUserId: jest.fn(),
} as unknown as jest.Mocked<ProjectController>;
