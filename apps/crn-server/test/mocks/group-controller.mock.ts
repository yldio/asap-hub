import { GroupController } from '../../src/controllers/groups';

export const groupControllerMock: jest.Mocked<GroupController> = {
  fetch: jest.fn(),
  fetchById: jest.fn(),
  fetchByTeamId: jest.fn(),
  fetchByUserId: jest.fn(),
};
