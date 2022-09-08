import { ProjectController } from '../../src/controllers/project.controller';

export const projectControllerMock: jest.Mocked<ProjectController> = {
  fetch: jest.fn(),
  fetchById: jest.fn(),
};
