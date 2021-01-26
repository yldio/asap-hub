import supertest from 'supertest';
import { appFactory } from '../../src/app';
import { FetchOptions } from '../../src/controllers/groups';
import * as fixtures from '../handlers/groups/fetch.fixtures';
import { authHandlerMock } from '../mocks/auth-handler.mock';
import { groupControllerMock } from '../mocks/group-controller.mock';

describe('/teams/ route', () => {
  const app = appFactory({
    groupController: groupControllerMock,
    authHandler: authHandlerMock,
  });

  afterEach(() => {
    groupControllerMock.fetchByTeamId.mockReset();
  });

  describe('GET /teams/{team_id}/groups', () => {
    test('Should return 200 when no grups exist', async () => {
      groupControllerMock.fetchByTeamId.mockResolvedValueOnce({
        items: [],
        total: 0,
      });

      const response = await supertest(app).get('/teams/123/groups');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        total: 0,
        items: [],
      });
    });

    test('Should return the results correctly', async () => {
      groupControllerMock.fetchByTeamId.mockResolvedValueOnce(
        fixtures.expectation,
      );

      const response = await supertest(app).get('/teams/123/groups');

      expect(response.body).toEqual(fixtures.expectation);
    });

    test('Should call the controller with the right parameters', async () => {
      groupControllerMock.fetchByTeamId.mockResolvedValueOnce({
        items: [],
        total: 0,
      });
      const teamId = '123abcd';

      await supertest(app).get(`/teams/${teamId}/groups`).query({
        take: 15,
        skip: 5,
        search: 'something',
      });

      const expectedParams: FetchOptions = {
        take: 15,
        skip: 5,
        search: 'something',
      };

      expect(groupControllerMock.fetchByTeamId).toBeCalledWith(
        teamId,
        expectedParams,
      );
    });

    describe('Parameter validation', () => {
      test('Should return a validation error when the arguments are not valid', async () => {
        const response = await supertest(app).get(`/teams/123/groups`).query({
          take: 'invalid param',
        });

        expect(response.status).toBe(400);
      });
    });
  });
});
