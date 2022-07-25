import { appFactory } from '../../src/app';
import { authHandlerMock } from '../mocks/auth-handler.mock';
import supertest from 'supertest';
import { discoverControllerMock } from '../mocks/discover-controller.mock';
import { squidexGraphqlDiscoverResponse } from '../fixtures/discover.fixtures';

describe('/discover/ route', () => {
  const app = appFactory({
    discoverController: discoverControllerMock,
    authHandler: authHandlerMock,
  });

  describe('GET /discover', () => {
    test('Should return 200 when no information exists', async () => {
      discoverControllerMock.fetch.mockResolvedValueOnce({
        aboutUs: '',
        training: [],
        members: [],
        scientificAdvisoryBoard: [],
        pages: [],
        workingGroups: [],
      });

      const response = await supertest(app).get('/discover');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        aboutUs: '',
        training: [],
        members: [],
        scientificAdvisoryBoard: [],
        pages: [],
        workingGroups: [],
      });
    });

    test('Should return the results correctly', async () => {
      const discoverResponse = squidexGraphqlDiscoverResponse();
      discoverControllerMock.fetch.mockResolvedValueOnce(discoverResponse);

      const response = await supertest(app).get('/discover');

      expect(response.body).toEqual(discoverResponse);
    });
  });
});
