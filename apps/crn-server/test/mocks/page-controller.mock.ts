import { PageController } from '../../src/controllers/pages';

export const pageControllerMock: jest.Mocked<PageController> = {
  fetchByPath: jest.fn(),
};
