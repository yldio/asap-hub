import { WorkingGroupNetworkDataProvider } from '../../src/data-providers/working-group-network.data-provider';

export const workingGroupNetworkDataProviderMock: jest.Mocked<WorkingGroupNetworkDataProvider> =
  {
    fetch: jest.fn(),
  };
