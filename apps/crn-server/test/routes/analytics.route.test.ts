import { ListAnalyticsTeamLeadershipResponse } from '@asap-hub/model';
import supertest from 'supertest';
import { appFactory } from '../../src/app';
import { getListAnalyticsTeamLeadershipResponse } from '../fixtures/analytics.fixtures';
import { analyticsControllerMock } from '../mocks/analytics.controller.mock';
import { authHandlerMock } from '../mocks/auth-handler.mock';
import { loggerMock } from '../mocks/logger.mock';

describe('/analytics/ route', () => {
  const app = appFactory({
    analyticsController: analyticsControllerMock,
    authHandler: authHandlerMock,
    logger: loggerMock,
  });

  describe('GET /analytics/team-leadership', () => {
    test('Should return 200 when no results are found', async () => {
      analyticsControllerMock.fetchTeamLeaderShip.mockResolvedValueOnce({
        total: 0,
        items: [],
      });
      const response = await supertest(app).get('/analytics/team-leadership');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        total: 0,
        items: [],
      } satisfies ListAnalyticsTeamLeadershipResponse);
    });

    test('Should return 500 when an error occurs', async () => {
      analyticsControllerMock.fetchTeamLeaderShip.mockRejectedValueOnce(
        new Error('Test error'),
      );
      const response = await supertest(app).get('/analytics/team-leadership');

      expect(response.status).toBe(500);
    });

    test('Should return the response from the controller', async () => {
      const listAnalyticsTeamLeadershipResponse =
        getListAnalyticsTeamLeadershipResponse();

      analyticsControllerMock.fetchTeamLeaderShip.mockResolvedValueOnce(
        listAnalyticsTeamLeadershipResponse,
      );
      const response = await supertest(app).get('/analytics/team-leadership');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(listAnalyticsTeamLeadershipResponse);
    });
  });
});
