import { UserDataProvider } from '../../src/data-providers/users.data-provider';

export const userDataProviderMock: jest.Mocked<UserDataProvider> = {
  fetchById: jest.fn(),
  update: jest.fn(),
  fetch: jest.fn(),
};
