import supertest from 'supertest';
import { appFactory } from '../../src/app';
import { authHandlerMock } from '../mocks/auth-handler.mock';
import { labControllerMock } from '../mocks/lab-controller.mock';
import { loggerMock } from '../mocks/logger.mock';

describe('/labs/ route', () => {
  const app = appFactory({
    labsController: labControllerMock,
    authHandler: authHandlerMock,
    logger: loggerMock,
  });
  afterEach(() => {
    labControllerMock.fetch.mockReset();
  });
  describe('GET /labs', () => {
    it('should return 200 when no labs exists', async () => {
      labControllerMock.fetch.mockResolvedValueOnce({ total: 0, items: [] });

      const response = await supertest(app).get('/labs');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ total: 0, items: [] });
    });

    describe('Parameter validation', () => {
      test('Should return a validation error when additional fields exist', async () => {
        const response = await supertest(app).get(`/labs`).query({
          additionalField: 'some-data',
        });
        expect(response.status).toBe(400);
      });
    });
  });
});
