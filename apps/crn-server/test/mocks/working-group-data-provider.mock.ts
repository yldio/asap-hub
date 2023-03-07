import { WorkingGroupDataProvider } from '../../src/data-providers/working-groups.data-provider';

export const workingGroupDataProviderMock: jest.Mocked<WorkingGroupDataProvider> =
  {
    fetchById: jest.fn(),
    fetch: jest.fn(),
    patch: jest.fn(),
  };
