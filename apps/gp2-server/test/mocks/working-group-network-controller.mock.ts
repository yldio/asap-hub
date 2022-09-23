import { WorkingGroupNetworkController } from '../../src/controllers/working-group-network.controller';

export const workingGroupNetworkControllerMock: jest.Mocked<WorkingGroupNetworkController> =
  {
    fetch: jest.fn(),
  };
