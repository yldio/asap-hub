import { WorkingGroupController } from '../../src/controllers/working-groups.controller';

export const workingGroupControllerMock: jest.Mocked<WorkingGroupController> = {
  fetchById: jest.fn(),
  fetch: jest.fn(),
};
