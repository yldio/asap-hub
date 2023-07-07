import supertest from 'supertest';
import { appFactory } from '../../src/app';
import { authHandlerMock } from '../mocks/auth-handler.mock';
import { guideControllerMock } from '../mocks/guide.controller.mock';
import { loggerMock } from '../mocks/logger.mock';

describe('/guides/ route', () => {
  const app = appFactory({
    guideController: guideControllerMock,
    authHandler: authHandlerMock,
    logger: loggerMock,
  });

  describe('GET /guides', () => {
    test('Should return 200 when no information exists', async () => {
      guideControllerMock.fetch.mockResolvedValueOnce({
        items: [],
        total: 0,
      });

      const response = await supertest(app).get('/guides');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        items: [],
        total: 0,
      });
    });

    test('Should return the results correctly', async () => {
      const guideResponse = { items: [], total: 0 };
      guideControllerMock.fetch.mockResolvedValueOnce(guideResponse);

      const response = await supertest(app).get('/guides');

      expect(response.body).toEqual(guideResponse);
    });
  });
});
