import { GroupDataProvider } from '../../src/data-providers/groups.data-provider';

export const groupDataProviderMock: jest.Mocked<GroupDataProvider> = {
  fetch: jest.fn(),
  fetchById: jest.fn(),
};
