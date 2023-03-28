import { PageController } from '../../src/controllers/page.controller';

export const pageControllerMock: jest.Mocked<PageController> = {
  fetchByPath: jest.fn(),
};
