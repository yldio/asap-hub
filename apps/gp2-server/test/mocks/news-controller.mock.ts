import { NewsController } from '../../src/controllers/news.controller';

export const newsControllerMock: jest.Mocked<NewsController> = {
  fetch: jest.fn(),
};
