import Boom from '@hapi/boom';
import { appFactory } from '../../src/app';
import { authHandlerMock } from '../mocks/auth-handler.mock';
import { newsControllerMock } from '../mocks/news-controller.mock';
import supertest from 'supertest';
import { listNewsResponse } from '../fixtures/news.fixtures';
import { NewsResponse } from '@asap-hub/model';

describe('/news/ route', () => {
  const app = appFactory({
    newsController: newsControllerMock,
    authHandler: authHandlerMock,
  });

  afterEach(() => {
    newsControllerMock.fetch.mockReset();
    newsControllerMock.fetchById.mockReset();
  });

  describe('GET /news', () => {
    test('Should return 200 when no news and events exist', async () => {
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
      newsControllerMock.fetch.mockResolvedValueOnce(listNewsResponse);

      const response = await supertest(app).get('/news');

      expect(response.body).toEqual(listNewsResponse);
    });

    test('Should call the controller with the right parameters', async () => {
      const expectedParams = {
        take: 15,
        skip: 5,
      };

      await supertest(app).get('/news').query(expectedParams);

      expect(newsControllerMock.fetch).toBeCalledWith(expectedParams);
    });

    describe('Parameter validation', () => {
      test('Should return a validation error when the arguments are not valid', async () => {
        const response = await supertest(app).get(`/news`).query({
          take: 'invalid param',
        });

        expect(response.status).toBe(400);
      });
    });
  });

  describe('GET /news/{news_and_events_id}', () => {
    test('Should return a 404 error when the news or events are not found', async () => {
      newsControllerMock.fetchById.mockRejectedValueOnce(Boom.notFound());

      const response = await supertest(app).get('/news/123');

      expect(response.status).toBe(404);
    });

    test('Should return the result correctly', async () => {
      const newsOrEventResponse: NewsResponse = {
        created: '2020-09-23T16:34:26.842Z',
        id: 'uuid',
        text: 'Text',
        title: 'Title',
        type: 'News',
      };

      newsControllerMock.fetchById.mockResolvedValueOnce(newsOrEventResponse);

      const response = await supertest(app).get('/news/123');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(newsOrEventResponse);
    });

    test('Should call the controller with the right parameter', async () => {
      const newsOrEventId = 'abc123';

      await supertest(app).get(`/news/${newsOrEventId}`);

      expect(newsControllerMock.fetchById).toBeCalledWith(newsOrEventId);
    });
  });
});
