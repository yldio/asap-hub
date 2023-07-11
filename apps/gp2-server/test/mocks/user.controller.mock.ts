import UserController from '../../src/controllers/user.controller';

export const userControllerMock = {
  fetch: jest.fn(),
  fetchById: jest.fn(),
  fetchByCode: jest.fn(),
  connectByCode: jest.fn(),
  update: jest.fn(),
  updateAvatar: jest.fn(),
} as unknown as jest.Mocked<UserController>;
