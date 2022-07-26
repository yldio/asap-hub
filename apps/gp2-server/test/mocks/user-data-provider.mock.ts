import { UserDataProvider } from '../../src/data-providers/user.data-provider';

export const userDataProviderMock: jest.Mocked<UserDataProvider> = {
  fetchById: jest.fn(),
  update: jest.fn(),
  fetch: jest.fn(),
};
