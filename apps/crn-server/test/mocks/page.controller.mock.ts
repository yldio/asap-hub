import PageController from '../../src/controllers/page.controller';

export const pageControllerMock = {
  fetchByPath: jest.fn(),
} as unknown as jest.Mocked<PageController>;
