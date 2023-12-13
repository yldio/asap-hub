import { DashboardResponse } from '@asap-hub/model';
import supertest from 'supertest';
import { appFactory } from '../../src/app';
import { getDashboardResponse } from '../fixtures/dashboard.fixtures';
import { authHandlerMock } from '../mocks/auth-handler.mock';
import { dashboardControllerMock } from '../mocks/dashboard.controller.mock';
import { loggerMock } from '../mocks/logger.mock';

describe('/dashboard/ route', () => {
  const app = appFactory({
    dashboardController: dashboardControllerMock,
    authHandler: authHandlerMock,
    logger: loggerMock,
  });

  describe('GET /dashboard', () => {
    test('Should return 200 when no news, pages or announcements are found', async () => {
      dashboardControllerMock.fetch.mockResolvedValueOnce({
        news: [],
        pages: [],
        announcements: [],
      });

      const response = await supertest(app).get('/dashboard');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        news: [],
        pages: [],
        announcements: [],
      } satisfies DashboardResponse);
    });

    test('Should return the results correctly', async () => {
      const dashboardResponse = getDashboardResponse();
      dashboardControllerMock.fetch.mockResolvedValueOnce(dashboardResponse);

      const response = await supertest(app).get('/dashboard');

      expect(response.body).toEqual(dashboardResponse);
    });
  });
});
