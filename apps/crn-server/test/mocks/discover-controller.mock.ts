import DiscoverController from '../../src/controllers/discover.controller';

export const discoverControllerMock = {
  fetch: jest.fn(),
} as unknown as jest.Mocked<DiscoverController>;
