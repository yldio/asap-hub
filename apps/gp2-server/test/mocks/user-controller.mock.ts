import { UserController } from '../../src/controllers/user.controller';

export const userControllerMock: jest.Mocked<UserController> = {
  fetch: jest.fn(),
  fetchById: jest.fn(),
  fetchByCode: jest.fn(),
  connectByCode: jest.fn(),
  update: jest.fn(),
};
