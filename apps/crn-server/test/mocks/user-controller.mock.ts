import UserController from '../../src/controllers/users.controller';

export const userControllerMock = {
  fetch: jest.fn(),
  fetchById: jest.fn(),
  fetchByCode: jest.fn(),
  connectByCode: jest.fn(),
  update: jest.fn(),
  updateAvatar: jest.fn(),
  syncOrcidProfile: jest.fn(),
} as unknown as jest.Mocked<UserController>;
