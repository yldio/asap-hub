import { NewsController } from '../../src/controllers/news';

export const newsControllerMock: jest.Mocked<NewsController> = {
  fetch: jest.fn(),
  fetchById: jest.fn(),
};
