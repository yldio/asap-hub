import WorkingGroupController from '../../src/controllers/working-groups.controller';

export const workingGroupControllerMock = {
  fetchById: jest.fn(),
  fetch: jest.fn(),
} as unknown as jest.Mocked<WorkingGroupController>;
