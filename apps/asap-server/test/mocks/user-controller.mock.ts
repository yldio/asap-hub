import { UserController } from '../../src/controllers/users';

export const userControllerMock: jest.Mocked<UserController> = {
  fetch: jest.fn(),
  fetchById: jest.fn(),
  fetchByCode: jest.fn(),
  fetchByRelationship: jest.fn(),
  connectByCode: jest.fn(),
  update: jest.fn(),
  updateAvatar: jest.fn(),
  syncOrcidProfile: jest.fn(),
};
