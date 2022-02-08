import { UserController } from '../../src/controllers/users';

export const userControllerMock: jest.Mocked<UserController> = {
  fetch: jest.fn(),
  fetchByLabId: jest.fn(),
  fetchById: jest.fn(),
  fetchByCode: jest.fn(),
  connectByCode: jest.fn(),
  update: jest.fn(),
  updateAvatar: jest.fn(),
  syncOrcidProfile: jest.fn(),
};
