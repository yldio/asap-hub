import { WorkingGroupController } from '../../src/controllers/working-groups';

export const workingGroupControllerMock: jest.Mocked<WorkingGroupController> = {
  fetchById: jest.fn(),
};
