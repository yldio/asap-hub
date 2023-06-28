import NewsController from '../../src/controllers/news.controller';

export const newsControllerMock = {
  fetch: jest.fn(),
  fetchById: jest.fn(),
} as unknown as jest.Mocked<NewsController>;
