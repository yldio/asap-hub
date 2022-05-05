import supertest from 'supertest';
import { appFactory } from '../../src/app';
import { authHandlerMock } from '../mocks/auth-handler.mock';
import { dashboardControllerMock } from '../mocks/dashboard-controller.mock';
import { squidexGraphqlDashboardResponse } from '../fixtures/dashboard.fixtures';

describe('/dashboard/ route', () => {
  const app = appFactory({
    dashboardController: dashboardControllerMock,
    authHandler: authHandlerMock,
  });

  describe('GET /dashboard', () => {
    test('Should return 200 when no news are found', async () => {
      dashboardControllerMock.fetch.mockResolvedValueOnce({
        news: [],
        pages: [],
      });

      const response = await supertest(app).get('/dashboard');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        news: [],
        pages: [],
      });
    });

    test('Should return the results correctly', async () => {
      const dashboardResponse = squidexGraphqlDashboardResponse();
      dashboardControllerMock.fetch.mockResolvedValueOnce(dashboardResponse);

      const response = await supertest(app).get('/dashboard');

      expect(response.body).toEqual(dashboardResponse);
    });
  });
});
