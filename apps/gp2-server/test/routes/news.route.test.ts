import supertest from 'supertest';
import { appFactory } from '../../src/app';
import { getListNewsResponse } from '../fixtures/news.fixtures';
import { authHandlerMock } from '../mocks/auth-handler.mock';
import { loggerMock } from '../mocks/logger.mock';
import { newsControllerMock } from '../mocks/news-controller.mock';

describe('/news/ route', () => {
  const app = appFactory({
    newsController: newsControllerMock,
    authHandler: authHandlerMock,
    logger: loggerMock,
  });

  beforeEach(jest.resetAllMocks);

  describe('GET /news', () => {
    test('Should return 200 when no news exists', async () => {
      newsControllerMock.fetch.mockResolvedValueOnce({
        total: 0,
        items: [],
      });

      const response = await supertest(app).get('/news');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        total: 0,
        items: [],
      });
    });

    test('Should return the results correctly', async () => {
      newsControllerMock.fetch.mockResolvedValueOnce(getListNewsResponse());

      const response = await supertest(app).get('/news');

      expect(newsControllerMock.fetch).toBeCalled();
      expect(response.status).toBe(200);
      expect(response.body).toEqual(getListNewsResponse());
    });
  });
});
