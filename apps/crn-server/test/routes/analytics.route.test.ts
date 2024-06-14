import {
  FetchPaginationOptions,
  ListAnalyticsTeamLeadershipResponse,
} from '@asap-hub/model';
import supertest from 'supertest';
import { appFactory } from '../../src/app';
import {
  getListAnalyticsTeamLeadershipResponse,
  getListTeamCollaborationResponse,
  getListTeamProductivityResponse,
  getListUserCollaborationResponse,
  getListUserProductivityResponse,
} from '../fixtures/analytics.fixtures';
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
      analyticsControllerMock.fetchTeamLeadership.mockResolvedValueOnce({
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
      analyticsControllerMock.fetchTeamLeadership.mockRejectedValueOnce(
        new Error('Test error'),
      );
      const response = await supertest(app).get('/analytics/team-leadership');

      expect(response.status).toBe(500);
    });

    test('Should return the response from the controller', async () => {
      const listAnalyticsTeamLeadershipResponse =
        getListAnalyticsTeamLeadershipResponse();

      analyticsControllerMock.fetchTeamLeadership.mockResolvedValueOnce(
        listAnalyticsTeamLeadershipResponse,
      );
      const response = await supertest(app).get('/analytics/team-leadership');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(listAnalyticsTeamLeadershipResponse);
    });

    test('Should call the controller with the correct parameters', async () => {
      await supertest(app).get('/analytics/team-leadership').query({
        take: 15,
        skip: 5,
      });

      expect(analyticsControllerMock.fetchTeamLeadership).toHaveBeenCalledWith({
        take: 15,
        skip: 5,
      } satisfies FetchPaginationOptions);
    });
  });

  describe('GET /analytics/productivity/user', () => {
    test('Should return 200 when no results are found', async () => {
      analyticsControllerMock.fetchUserProductivity.mockResolvedValueOnce({
        total: 0,
        items: [],
      });
      const response = await supertest(app).get('/analytics/productivity/user');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        total: 0,
        items: [],
      });
    });

    test('Should return 500 when an error occurs', async () => {
      analyticsControllerMock.fetchUserProductivity.mockRejectedValueOnce(
        new Error('Test error'),
      );
      const response = await supertest(app).get('/analytics/productivity/user');

      expect(response.status).toBe(500);
    });

    test('Should return the response from the controller', async () => {
      analyticsControllerMock.fetchUserProductivity.mockResolvedValueOnce(
        getListUserProductivityResponse(),
      );
      const response = await supertest(app).get('/analytics/productivity/user');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(getListUserProductivityResponse());
    });

    test('Should call the controller with the correct parameters', async () => {
      await supertest(app).get('/analytics/productivity/user').query({
        take: 15,
        skip: 5,
      });

      expect(
        analyticsControllerMock.fetchUserProductivity,
      ).toHaveBeenCalledWith({
        take: 15,
        skip: 5,
      } satisfies FetchPaginationOptions);
    });
  });

  describe('GET /analytics/productivity/team', () => {
    test('Should return 200 when no results are found', async () => {
      analyticsControllerMock.fetchTeamProductivity.mockResolvedValueOnce({
        total: 0,
        items: [],
      });
      const response = await supertest(app).get('/analytics/productivity/team');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        total: 0,
        items: [],
      });
    });

    test('Should return 500 when an error occurs', async () => {
      analyticsControllerMock.fetchTeamProductivity.mockRejectedValueOnce(
        new Error('Test error'),
      );
      const response = await supertest(app).get('/analytics/productivity/team');

      expect(response.status).toBe(500);
    });

    test('Should return the response from the controller', async () => {
      analyticsControllerMock.fetchTeamProductivity.mockResolvedValueOnce(
        getListTeamProductivityResponse(),
      );
      const response = await supertest(app).get('/analytics/productivity/team');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(getListTeamProductivityResponse());
    });

    test('Should call the controller with the correct parameters', async () => {
      await supertest(app).get('/analytics/productivity/team').query({
        take: 15,
        skip: 5,
      });

      expect(
        analyticsControllerMock.fetchTeamProductivity,
      ).toHaveBeenCalledWith({
        take: 15,
        skip: 5,
      } satisfies FetchPaginationOptions);
    });
  });

  describe('GET /analytics/collaboration/user', () => {
    test('Should return 200 when no results are found', async () => {
      analyticsControllerMock.fetchUserCollaboration.mockResolvedValueOnce({
        total: 0,
        items: [],
      });
      const response = await supertest(app).get(
        '/analytics/collaboration/user',
      );

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        total: 0,
        items: [],
      });
    });

    test('Should return 500 when an error occurs', async () => {
      analyticsControllerMock.fetchUserCollaboration.mockRejectedValueOnce(
        new Error('Test error'),
      );
      const response = await supertest(app).get(
        '/analytics/collaboration/user',
      );

      expect(response.status).toBe(500);
    });

    test('Should return the response from the controller', async () => {
      analyticsControllerMock.fetchUserCollaboration.mockResolvedValueOnce(
        getListUserCollaborationResponse(),
      );
      const response = await supertest(app).get(
        '/analytics/collaboration/user',
      );

      expect(response.status).toBe(200);
      expect(response.body).toEqual(getListUserCollaborationResponse());
    });

    test('Should call the controller with the correct parameters', async () => {
      await supertest(app).get('/analytics/collaboration/user').query({
        take: 15,
        skip: 5,
      });

      expect(
        analyticsControllerMock.fetchUserCollaboration,
      ).toHaveBeenCalledWith({
        take: 15,
        skip: 5,
      } satisfies FetchPaginationOptions);
    });
  });

  describe('GET /analytics/collaboration/team', () => {
    test('Should return 200 when no results are found', async () => {
      analyticsControllerMock.fetchTeamCollaboration.mockResolvedValueOnce({
        total: 0,
        items: [],
      });
      const response = await supertest(app).get(
        '/analytics/collaboration/team',
      );

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        total: 0,
        items: [],
      });
    });

    test('Should return 500 when an error occurs', async () => {
      analyticsControllerMock.fetchTeamCollaboration.mockRejectedValueOnce(
        new Error('Test error'),
      );
      const response = await supertest(app).get(
        '/analytics/collaboration/team',
      );

      expect(response.status).toBe(500);
    });

    test('Should return the response from the controller', async () => {
      analyticsControllerMock.fetchTeamCollaboration.mockResolvedValueOnce(
        getListTeamCollaborationResponse(),
      );
      const response = await supertest(app).get(
        '/analytics/collaboration/team',
      );

      expect(response.status).toBe(200);
      expect(response.body).toEqual(getListTeamCollaborationResponse());
    });

    test('Should call the controller with the correct parameters', async () => {
      await supertest(app).get('/analytics/collaboration/team').query({
        take: 15,
        skip: 5,
      });

      expect(
        analyticsControllerMock.fetchTeamCollaboration,
      ).toHaveBeenCalledWith({
        take: 15,
        skip: 5,
      } satisfies FetchPaginationOptions);
    });
  });
});
