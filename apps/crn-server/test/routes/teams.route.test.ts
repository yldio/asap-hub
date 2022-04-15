import supertest from 'supertest';
import Boom from '@hapi/boom';
import { User, userMock } from '@asap-hub/auth';
import { appFactory } from '../../src/app';
import { FetchOptions } from '../../src/utils/types';
import * as fixtures from '../fixtures/groups.fixtures';
import { groupControllerMock } from '../mocks/group-controller.mock';
import { teamControllerMock } from '../mocks/team-controller.mock';
import {
  getListTeamResponse,
  getTeamResponse,
} from '../fixtures/teams.fixtures';
import { AuthHandler } from '../../src/middleware/auth-handler';
import { FetchTeamsOptions } from '../../src/controllers/teams';

describe('/teams/ route', () => {
  const loggedUser: User = {
    ...userMock,
    teams: [
      {
        id: 'team-id-1',
        role: 'Project Manager',
      },
    ],
  };
  const getLoggedUser = jest.fn().mockReturnValue(loggedUser);
  const authHandlerMock: AuthHandler = (req, _res, next) => {
    req.loggedInUser = getLoggedUser();
    next();
  };

  const app = appFactory({
    groupController: groupControllerMock,
    teamController: teamControllerMock,
    authHandler: authHandlerMock,
  });

  afterEach(() => {
    jest.clearAllMocks();
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
        fixtures.listGroupsResponse,
      );

      const response = await supertest(app).get('/teams/123/groups');

      expect(response.body).toEqual(fixtures.listGroupsResponse);
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
      test('Should return a 400 error when additional properties exist', async () => {
        const response = await supertest(app).get('/teams/123/groups').query({
          additionalField: 'some-data',
        });

        expect(response.status).toBe(400);
      });

      test('Should return a validation error when the arguments are not valid', async () => {
        const response = await supertest(app).get(`/teams/123/groups`).query({
          take: 'invalid param',
        });

        expect(response.status).toBe(400);
      });
    });
  });

  describe('GET /teams', () => {
    test('Should return 200 when no teams exist', async () => {
      teamControllerMock.fetch.mockResolvedValueOnce({
        items: [],
        total: 0,
      });

      const response = await supertest(app).get('/teams');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        total: 0,
        items: [],
      });
    });

    test('Should return the results correctly', async () => {
      teamControllerMock.fetch.mockResolvedValueOnce(getListTeamResponse());

      const response = await supertest(app).get('/teams');

      expect(response.body).toEqual(getListTeamResponse());
    });

    test('Should call the controller with the right parameters', async () => {
      teamControllerMock.fetch.mockResolvedValueOnce(getListTeamResponse());

      const params: FetchOptions = {
        take: 15,
        skip: 5,
        search: 'something',
        filter: ['one', 'two'],
      };

      await supertest(app).get('/teams').query(params);

      const expectedParams: FetchTeamsOptions = {
        ...(params as Required<FetchOptions>),
        showTeamTools: [loggedUser.teams[0]!.id],
      };

      expect(teamControllerMock.fetch).toBeCalledWith(expectedParams);
    });

    describe('Team tools', () => {
      test('Should select the team tools for the teams the user is a member of', async () => {
        teamControllerMock.fetch.mockResolvedValueOnce(getListTeamResponse());
        getLoggedUser.mockReturnValueOnce({
          ...userMock,
          teams: [
            {
              id: 'team-id-1',
              role: 'Project Manager',
            },
            {
              id: 'team-id-2',
              role: 'Some role',
            },
            {
              id: 'team-id-3',
              role: 'Some other role',
            },
          ],
        });

        const params: FetchOptions = {
          take: 15,
          skip: 5,
        };

        await supertest(app).get('/teams').query(params);

        const expectedParams: FetchTeamsOptions = {
          take: 15,
          skip: 5,
          showTeamTools: ['team-id-1', 'team-id-2', 'team-id-3'],
        };

        expect(teamControllerMock.fetch).toBeCalledWith(expectedParams);
      });
    });

    describe('Parameter validation', () => {
      test('Should return a 400 error when additional properties exist', async () => {
        const response = await supertest(app).get('/teams').query({
          additionalField: 'some-data',
        });

        expect(response.status).toBe(400);
      });

      test('Should return a validation error when the arguments are not valid', async () => {
        const response = await supertest(app).get(`/teams`).query({
          take: 'invalid param',
        });

        expect(response.status).toBe(400);
      });
    });
  });

  describe('GET /teams/{team_id}', () => {
    const teamResponse = getTeamResponse();
    test('Should return a 404 error when the team or members are not found', async () => {
      teamControllerMock.fetchById.mockRejectedValueOnce(Boom.notFound());

      const response = await supertest(app).get('/teams/123');

      expect(response.status).toBe(404);
    });

    test('Should return the result correctly', async () => {
      teamControllerMock.fetchById.mockResolvedValueOnce(teamResponse);

      const response = await supertest(app).get('/teams/123');

      expect(response.body).toEqual(teamResponse);
    });

    test('Should call the controller with the right parameters', async () => {
      const teamId = 'abc123';

      teamControllerMock.fetchById.mockResolvedValueOnce(teamResponse);

      await supertest(app).get(`/teams/${teamId}`);

      expect(teamControllerMock.fetchById).toBeCalledWith(teamId, {
        showTools: expect.any(Boolean),
      });
    });

    describe('Team tools', () => {
      test('Should ask the controller to hide the tools when the user is not part of the requested team', async () => {
        const teamId = 'abc123';

        teamControllerMock.fetchById.mockResolvedValueOnce(teamResponse);

        await supertest(app).get(`/teams/${teamId}`);

        expect(teamControllerMock.fetchById).toBeCalledWith(teamId, {
          showTools: false,
        });
      });

      test('Should ask the controller to display the tools when the user is part of the requested team', async () => {
        const teamId = loggedUser.teams[0]!.id;

        teamControllerMock.fetchById.mockResolvedValueOnce(teamResponse);

        await supertest(app).get(`/teams/${teamId}`);

        expect(teamControllerMock.fetchById).toBeCalledWith(teamId, {
          showTools: true,
        });
      });
    });
  });

  describe('PATCH /teams/{team_id}', () => {
    const teamResponse = getTeamResponse();
    test('Should return a 400 error when the payload is invalid', async () => {
      const response = await supertest(app).patch('/teams/123').send({
        tools: 'something',
      });

      expect(response.status).toBe(400);
    });

    test('Should return a 400 error when additional properties exist', async () => {
      const response = await supertest(app).patch('/teams/123').send({
        tools: [],
        additionalField: 'some-data',
      });

      expect(response.status).toBe(400);
    });

    test('Should return a 403 error when the user is not part of the the team', async () => {
      const response = await supertest(app).patch('/teams/not-my-team').send({
        tools: [],
      });

      expect(response.status).toBe(403);
    });

    test('Should return a 404 error when the team does not exist', async () => {
      teamControllerMock.update.mockRejectedValueOnce(Boom.notFound());

      const response = await supertest(app).patch('/teams/team-id-1').send({
        tools: [],
      });

      expect(response.status).toBe(404);
    });

    test('Should return the results correctly', async () => {
      teamControllerMock.update.mockResolvedValueOnce(teamResponse);

      const response = await supertest(app).patch('/teams/team-id-1').send({
        tools: [],
      });

      expect(response.body).toEqual(teamResponse);
    });

    test('Should call the controller with the right parameters', async () => {
      const teamId = 'team-id-1';
      const tools = [
        {
          url: 'https://example.com',
          name: 'good line',
        },
      ];

      await supertest(app).patch(`/teams/${teamId}`).send({
        tools,
      });

      expect(teamControllerMock.update).toBeCalledWith(teamId, tools);
    });
  });
});
