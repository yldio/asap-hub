import { WorkingGroupDataProvider } from '../../src/data-providers/working-group.data-provider';

export const workingGroupDataProviderMock: jest.Mocked<WorkingGroupDataProvider> =
  {
    fetchById: jest.fn(),
    fetch: jest.fn(),
  };
