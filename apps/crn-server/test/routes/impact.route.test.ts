import supertest from 'supertest';
import { appFactory } from '../../src/app';
import ImpactController from '../../src/controllers/impact.controller';
import { authHandlerMock } from '../mocks/auth-handler.mock';
import { loggerMock } from '../mocks/logger.mock';

describe('/impact/ route', () => {
  const impactControllerMock = {
    fetch: jest.fn(),
  } as unknown as jest.Mocked<ImpactController>;
  const app = appFactory({
    impactController: impactControllerMock,
    authHandler: authHandlerMock,
    logger: loggerMock,
  });
  afterEach(() => {
    impactControllerMock.fetch.mockReset();
  });
  describe('GET /impact', () => {
    it('should return 200 when no impacts exists', async () => {
      impactControllerMock.fetch.mockResolvedValueOnce({ total: 0, items: [] });

      const response = await supertest(app).get('/impact');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ total: 0, items: [] });
    });

    it('should return 200 when impacts exists', async () => {
      impactControllerMock.fetch.mockResolvedValueOnce({
        total: 1,
        items: [
          {
            id: '1',
            name: 'Impact 1',
          },
        ],
      });

      const response = await supertest(app).get('/impact');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        total: 1,
        items: [
          {
            id: '1',
            name: 'Impact 1',
          },
        ],
      });
    });

    describe('Parameter validation', () => {
      test('Should return a validation error when additional fields exist', async () => {
        const response = await supertest(app).get(`/impact`).query({
          additionalField: 'some-data',
        });
        expect(response.status).toBe(400);
      });
    });
  });
});
