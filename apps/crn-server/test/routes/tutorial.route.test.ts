import Boom from '@hapi/boom';
import supertest from 'supertest';
import { appFactory } from '../../src/app';
import { getTutorialResponse } from '../fixtures/tutorials.fixtures';
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
    tutorialControllerMock.fetchById.mockReset();
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
