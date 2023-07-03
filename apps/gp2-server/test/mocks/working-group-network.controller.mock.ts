import WorkingGroupNetworkController from '../../src/controllers/working-group-network.controller';
export const workingGroupNetworkControllerMock = {
  fetch: jest.fn(),
} as unknown as jest.Mocked<WorkingGroupNetworkController>;
