import supertest from 'supertest';
import { appFactory } from '../../src/app';
import { authHandlerMock } from '../mocks/auth-handler.mock';
import { loggerMock } from '../mocks/logger.mock';
import { keywordControllerMock } from '../mocks/keyword.controller.mock';
import { getListKeywordsResponse } from '../fixtures/keyword.fixtures';

describe('/keywords/ route', () => {
  const app = appFactory({
    keywordController: keywordControllerMock,
    authHandler: authHandlerMock,
    logger: loggerMock,
  });

  beforeEach(jest.resetAllMocks);

  describe('GET /keywords', () => {
    test('Should return 200 when no keywords stats exist', async () => {
      keywordControllerMock.fetch.mockResolvedValueOnce({
        total: 0,
        items: [],
      });

      const response = await supertest(app).get('/keywords');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        total: 0,
        items: [],
      });
    });

    test('Should return the results correctly', async () => {
      keywordControllerMock.fetch.mockResolvedValueOnce(
        getListKeywordsResponse(),
      );

      const response = await supertest(app).get('/keywords');

      expect(keywordControllerMock.fetch).toBeCalled();
      expect(response.status).toBe(200);
      expect(response.body).toEqual(getListKeywordsResponse());
    });
  });
});
