import { PageController } from '../../src/controllers/pages.controller';

export const pageControllerMock: jest.Mocked<PageController> = {
  fetchByPath: jest.fn(),
};
