import { WorkingGroupDataProvider } from '../../src/data-providers/types/working-group.data-provider.type';

export const workingGroupDataProviderMock: jest.Mocked<WorkingGroupDataProvider> =
  {
    fetchById: jest.fn(),
    fetch: jest.fn(),
    update: jest.fn(),
  };
