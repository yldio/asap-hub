import { UserDataProvider } from '../../src/data-providers/types';

export const userDataProviderMock: jest.Mocked<UserDataProvider> = {
  fetchById: jest.fn(),
  update: jest.fn(),
  fetch: jest.fn(),
  create: jest.fn(),
};
