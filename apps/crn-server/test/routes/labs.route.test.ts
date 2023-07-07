import supertest from 'supertest';
import { appFactory } from '../../src/app';
import LabController from '../../src/controllers/lab.controller';
import { authHandlerMock } from '../mocks/auth-handler.mock';
import { loggerMock } from '../mocks/logger.mock';

describe('/labs/ route', () => {
  const labsControlerMock = {
    fetch: jest.fn(),
  } as unknown as jest.Mocked<LabController>;
  const app = appFactory({
    labsController: labsControlerMock,
    authHandler: authHandlerMock,
    logger: loggerMock,
  });
  afterEach(() => {
    labsControlerMock.fetch.mockReset();
  });
  describe('GET /labs', () => {
    it('should return 200 when no labs exists', async () => {
      labsControlerMock.fetch.mockResolvedValueOnce({ total: 0, items: [] });

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
