import supertest from 'supertest';
import { appFactory } from '../../src/app';
import { LabsController } from '../../src/controllers/labs';
import { authHandlerMock } from '../mocks/auth-handler.mock';

describe('/labs/ route', () => {
  const labsControlerMock: jest.Mocked<LabsController> = {
    fetch: jest.fn(),
  };
  const app = appFactory({
    labsController: labsControlerMock,
    authHandler: authHandlerMock,
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
  });
});
