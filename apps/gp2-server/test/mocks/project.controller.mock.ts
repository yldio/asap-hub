import ProjectController from '../../src/controllers/project.controller';
export const projectControllerMock = {
  fetchById: jest.fn(),
  fetch: jest.fn(),
  update: jest.fn(),
} as unknown as jest.Mocked<ProjectController>;
