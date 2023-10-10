import Boom from '@hapi/boom';
import supertest from 'supertest';
import { appFactory } from '../../src/app';
import {
  getTutorialResponse,
  getListTutorialsResponse,
} from '../fixtures/tutorials.fixtures';
import { loggerMock } from '../mocks/logger.mock';
import { tutorialControllerMock } from '../mocks/tutorial.controller.mock';
import { authHandlerMock } from '../mocks/auth-handler.mock';

describe('/tutorials/ route', () => {
  const app = appFactory({
    tutorialsController: tutorialControllerMock,
    authHandler: authHandlerMock,
    logger: loggerMock,
  });

  afterEach(() => {
    tutorialControllerMock.fetch.mockReset();
    tutorialControllerMock.fetchById.mockReset();
  });

  describe('GET /tutorials', () => {
    test('Should return 200 when no tutorial exists', async () => {
      tutorialControllerMock.fetch.mockResolvedValueOnce({
        total: 0,
        items: [],
      });

      const response = await supertest(app).get('/tutorials');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        total: 0,
        items: [],
      });
    });

    test('Should return the results correctly', async () => {
      tutorialControllerMock.fetch.mockResolvedValueOnce(
        getListTutorialsResponse(),
      );

      const response = await supertest(app).get('/tutorials');

      expect(response.body).toEqual(getListTutorialsResponse());
    });

    test('Should call the controller with the right parameters', async () => {
      const expectedParams = {
        take: 15,
        skip: 5,
      };

      await supertest(app).get('/tutorials').query(expectedParams);

      expect(tutorialControllerMock.fetch).toBeCalledWith(expectedParams);
    });

    test('Should call the controller with the right search params', async () => {
      const expectedParams = {
        take: 15,
        skip: 5,
        search: 'search',
      };

      await supertest(app).get('/tutorials').query(expectedParams);

      expect(tutorialControllerMock.fetch).toBeCalledWith({
        ...expectedParams,
      });
    });

    describe('Parameter validation', () => {
      test('Should return a validation error when additional fields exist', async () => {
        const response = await supertest(app).get(`/tutorials`).query({
          additionalField: 'some-data',
        });
        expect(response.status).toBe(400);
      });

      test('Should return a validation error when the arguments are not valid', async () => {
        const response = await supertest(app).get(`/tutorials`).query({
          take: 'invalid param',
        });

        expect(response.status).toBe(400);
      });
    });
  });

  describe('GET /tutorials/{tutorial_id}', () => {
    const tutorialResponse = getTutorialResponse();
    test('Should return a 404 error when the tutorial is not found', async () => {
      tutorialControllerMock.fetchById.mockRejectedValueOnce(Boom.notFound());

      const response = await supertest(app).get('/tutorials/123');

      expect(response.status).toBe(404);
    });

    test('Should return the result correctly', async () => {
      tutorialControllerMock.fetchById.mockResolvedValueOnce(tutorialResponse);

      const response = await supertest(app).get('/tutorials/123');

      expect(response.body).toEqual(tutorialResponse);
    });

    test('Should call the controller with the right parameters', async () => {
      const tutorialId = 'abc123';

      tutorialControllerMock.fetchById.mockResolvedValueOnce(tutorialResponse);

      await supertest(app).get(`/tutorials/${tutorialId}`);

      expect(tutorialControllerMock.fetchById).toBeCalledWith(tutorialId);
    });
  });
});
