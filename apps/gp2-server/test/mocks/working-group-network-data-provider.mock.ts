import { WorkingGroupNetworkDataProvider } from '../../src/data-providers/types';

export const workingGroupNetworkDataProviderMock: jest.Mocked<WorkingGroupNetworkDataProvider> =
  {
    fetch: jest.fn(),
    fetchById: jest.fn(),
  };
