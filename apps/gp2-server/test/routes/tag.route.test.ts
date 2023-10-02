import supertest from 'supertest';
import { appFactory } from '../../src/app';
import { authHandlerMock } from '../mocks/auth-handler.mock';
import { loggerMock } from '../mocks/logger.mock';
import { tagControllerMock } from '../mocks/tag.controller.mock';
import { getListTagsResponse } from '../fixtures/tag.fixtures';

describe('/tags route', () => {
  const app = appFactory({
    tagController: tagControllerMock,
    authHandler: authHandlerMock,
    logger: loggerMock,
  });

  beforeEach(jest.resetAllMocks);

  describe('GET /tags', () => {
    test('Should return 200 when no tags stats exist', async () => {
      tagControllerMock.fetch.mockResolvedValueOnce({
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
      tagControllerMock.fetch.mockResolvedValueOnce(getListTagsResponse());

      const response = await supertest(app).get('/keywords');

      expect(tagControllerMock.fetch).toBeCalled();
      expect(response.status).toBe(200);
      expect(response.body).toEqual(getListTagsResponse());
    });
  });
});
