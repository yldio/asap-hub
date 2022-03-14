import { DiscoverController } from '../../src/controllers/discover';

export const discoverControllerMock: jest.Mocked<DiscoverController> = {
  fetch: jest.fn(),
};
