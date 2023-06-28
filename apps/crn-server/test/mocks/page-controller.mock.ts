import PageController from '../../src/controllers/pages.controller';

export const pageControllerMock = {
  fetchByPath: jest.fn(),
} as unknown as jest.Mocked<PageController>;
