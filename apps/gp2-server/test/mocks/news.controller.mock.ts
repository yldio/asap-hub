import NewsController from '../../src/controllers/news.controller';

export const newsControllerMock = {
  fetchById: jest.fn(),
  fetch: jest.fn(),
} as unknown as jest.Mocked<NewsController>;
