import supertest from 'supertest';
import { appFactory } from '../../src/app';
import { getListDashboardResponse } from '../fixtures/dashboard.fixtures';
import { authHandlerMock } from '../mocks/auth-handler.mock';
import { loggerMock } from '../mocks/logger.mock';
import { dashboardControllerMock } from '../mocks/dashboard-controller.mock';

describe('/dashboard/ route', () => {
  const app = appFactory({
    dashboardController: dashboardControllerMock,
    authHandler: authHandlerMock,
    logger: loggerMock,
  });

  beforeEach(jest.resetAllMocks);

  describe('GET /dashboard', () => {
    test('Should return 200 when no dashboard stats exist', async () => {
      dashboardControllerMock.fetch.mockResolvedValueOnce({
        total: 0,
        items: [],
      });

      const response = await supertest(app).get('/dashboard');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        total: 0,
        items: [],
      });
    });

    test('Should return the results correctly', async () => {
      dashboardControllerMock.fetch.mockResolvedValueOnce(
        getListDashboardResponse(),
      );

      const response = await supertest(app).get('/dashboard');

      expect(dashboardControllerMock.fetch).toBeCalled();
      expect(response.status).toBe(200);
      expect(response.body).toEqual(getListDashboardResponse());
    });
  });
});
