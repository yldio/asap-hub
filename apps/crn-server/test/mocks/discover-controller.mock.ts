import { DiscoverController } from '../../src/controllers/discover.controller';

export const discoverControllerMock: jest.Mocked<DiscoverController> = {
  fetch: jest.fn(),
};
