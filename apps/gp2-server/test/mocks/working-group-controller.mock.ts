import { WorkingGroupController } from '../../src/controllers/working-group.controller';

export const workingGroupControllerMock: jest.Mocked<WorkingGroupController> = {
  fetch: jest.fn(),
  fetchById: jest.fn(),
};
