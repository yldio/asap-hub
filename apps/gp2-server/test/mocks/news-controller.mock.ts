import NewsController from '../../src/controllers/news.controller';

export const newsControllerMock = {
  fetch: jest.fn(),
} as unknown as jest.Mocked<NewsController>;
