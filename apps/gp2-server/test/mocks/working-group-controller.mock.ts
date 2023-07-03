import WorkingGroupController from '../../src/controllers/working-group.controller';

export const workingGroupControllerMock = {
  fetchById: jest.fn(),
  fetch: jest.fn(),
  update: jest.fn(),
} as unknown as jest.Mocked<WorkingGroupController>;
