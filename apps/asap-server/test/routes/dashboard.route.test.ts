import { appFactory } from '../../src/app';
import { authHandlerMock } from '../mocks/auth-handler.mock';
import { dashboardControllerMock } from '../mocks/dashboard-controller.mock';
import supertest from 'supertest';
import { dashboardResponse } from '../fixtures/dashboard.fixtures';

describe('/dashboard/ route', () => {
  const app = appFactory({
    dashboardController: dashboardControllerMock,
    authHandler: authHandlerMock,
  });

  describe('GET /dashboard', () => {
    test('Should return 200 when no news are found', async () => {
      dashboardControllerMock.fetch.mockResolvedValueOnce({
        newsAndEvents: [],
        pages: [],
      });

      const response = await supertest(app).get('/dashboard');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        newsAndEvents: [],
        pages: [],
      });
    });

    test('Should return the results correctly', async () => {
      dashboardControllerMock.fetch.mockResolvedValueOnce(dashboardResponse);

      const response = await supertest(app).get('/dashboard');

      expect(response.body).toEqual(dashboardResponse);
    });
  });
});
