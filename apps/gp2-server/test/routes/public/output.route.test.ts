import supertest from 'supertest';
import { publicAppFactory } from '../../../src/publicApp';
import {
  getListOutputResponse,
  getListPublicOutputResponse,
} from '../../fixtures/output.fixtures';
import { outputControllerMock } from '../../mocks/output.controller.mock';

describe('/outputs/ route', () => {
  const publicApp = publicAppFactory({
    outputController: outputControllerMock,
  });

  afterEach(jest.clearAllMocks);

  describe('GET /outputs', () => {
    test('Should return 200 when no output exists', async () => {
      outputControllerMock.fetch.mockResolvedValueOnce({
        items: [],
        total: 0,
      });

      const response = await supertest(publicApp).get('/public/outputs');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        total: 0,
        items: [],
      });
    });

    test('Should return the results correctly', async () => {
      const listOutputResponse = getListOutputResponse();
      const listPublicOutputResponse = getListPublicOutputResponse();

      outputControllerMock.fetch.mockResolvedValueOnce(listOutputResponse);

      const response = await supertest(publicApp).get('/public/outputs');

      expect(response.body).toEqual(listPublicOutputResponse);
    });
  });
});
