import { NewsAndEventsController } from '../../src/controllers/news-and-events';

export const newsAndEventsControllerMock: jest.Mocked<NewsAndEventsController> =
  {
    fetch: jest.fn(),
    fetchById: jest.fn(),
  };
