import Boom from '@hapi/boom';
import { appFactory } from '../../src/app';
import { authHandlerMock } from '../mocks/auth-handler.mock';
import { newsAndEventsControllerMock } from '../mocks/news-and-events-controller.mock';
import supertest from 'supertest';
import { listNewsAndEventsResponse } from '../fixtures/news-and-events.fixtures';
import { NewsOrEventResponse } from '@asap-hub/model';
import { loggerMock } from '../mocks/logger.mock';

describe('/news-and-events/ route', () => {
  const app = appFactory({
    newsAndEventsController: newsAndEventsControllerMock,
    authHandler: authHandlerMock,
    logger: loggerMock,
  });

  afterEach(() => {
    newsAndEventsControllerMock.fetch.mockReset();
    newsAndEventsControllerMock.fetchById.mockReset();
  });

  describe('GET /news-and-events', () => {
    test('Should return 200 when no news and events exist', async () => {
      newsAndEventsControllerMock.fetch.mockResolvedValueOnce({
        total: 0,
        items: [],
      });

      const response = await supertest(app).get('/news-and-events');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        total: 0,
        items: [],
      });
    });

    test('Should return the results correctly', async () => {
      newsAndEventsControllerMock.fetch.mockResolvedValueOnce(
        listNewsAndEventsResponse,
      );

      const response = await supertest(app).get('/news-and-events');

      expect(response.body).toEqual(listNewsAndEventsResponse);
    });

    test('Should call the controller with the right parameters', async () => {
      const expectedParams = {
        take: 15,
        skip: 5,
      };

      await supertest(app).get('/news-and-events').query(expectedParams);

      expect(newsAndEventsControllerMock.fetch).toBeCalledWith(expectedParams);
    });

    describe('Parameter validation', () => {
      test('Should return a validation error when the arguments are not valid', async () => {
        const response = await supertest(app).get(`/news-and-events`).query({
          take: 'invalid param',
        });

        expect(response.status).toBe(400);
      });
    });
  });

  describe('GET /news-and-events/{news_and_events_id}', () => {
    test('Should return a 404 error when the news or events are not found', async () => {
      newsAndEventsControllerMock.fetchById.mockRejectedValueOnce(
        Boom.notFound(),
      );

      const response = await supertest(app).get('/news-and-events/123');

      expect(response.status).toBe(404);
    });

    test('Should return the result correctly', async () => {
      const newsOrEventResponse: NewsOrEventResponse = {
        created: '2020-09-23T16:34:26.842Z',
        id: 'uuid',
        text: 'Text',
        title: 'Title',
        type: 'News',
      };

      newsAndEventsControllerMock.fetchById.mockResolvedValueOnce(
        newsOrEventResponse,
      );

      const response = await supertest(app).get('/news-and-events/123');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(newsOrEventResponse);
    });

    test('Should call the controller with the right parameter', async () => {
      const newsOrEventId = 'abc123';

      await supertest(app).get(`/news-and-events/${newsOrEventId}`);

      expect(newsAndEventsControllerMock.fetchById).toBeCalledWith(
        newsOrEventId,
      );
    });
  });
});
