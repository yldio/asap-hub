import { FetchOptions, TeamMember } from '@asap-hub/model';

import Boom from '@hapi/boom';
import supertest from 'supertest';
import { publicAppFactory } from '../../../src/publicApp';
import {
  getListPublicTeamResponse,
  getPublicTeamResponse,
  getTeamResponse,
} from '../../fixtures/teams.fixtures';
import { teamControllerMock } from '../../mocks/team.controller.mock';

describe('/teams/ route', () => {
  const publicApp = publicAppFactory({
    teamController: teamControllerMock,
    cacheMiddleware: (_req, _res, next) => next(),
  });

  afterEach(jest.clearAllMocks);

  describe('GET /teams', () => {
    test('Should return 200 when no teams exist', async () => {
      teamControllerMock.fetchPublicTeams.mockResolvedValueOnce({
        items: [],
        total: 0,
      });

      const response = await supertest(publicApp).get('/public/teams');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        total: 0,
        items: [],
      });
    });

    test('Should return the results correctly', async () => {
      teamControllerMock.fetchPublicTeams.mockResolvedValueOnce(
        getListPublicTeamResponse(),
      );

      const response = await supertest(publicApp).get('/public/teams');

      expect(response.body).toEqual(getListPublicTeamResponse());
    });

    test('Should call the controller with the right parameters', async () => {
      teamControllerMock.fetchPublicTeams.mockResolvedValueOnce(
        getListPublicTeamResponse(),
      );

      const params: FetchOptions = {
        take: 15,
        skip: 5,
      };

      await supertest(publicApp).get('/public/teams').query(params);

      expect(teamControllerMock.fetchPublicTeams).toHaveBeenCalledWith(params);
    });

    describe('Parameter validation', () => {
      test('Should return a 400 error when additional properties exist', async () => {
        const response = await supertest(publicApp).get('/public/teams').query({
          additionalField: 'some-data',
        });

        expect(response.status).toBe(400);
      });

      test('Should return a validation error when the arguments are not valid', async () => {
        const response = await supertest(publicApp).get(`/public/teams`).query({
          take: 'invalid param',
        });

        expect(response.status).toBe(400);
      });
    });
  });

  describe('GET /teams/{team_id}', () => {
    const teamResponse = getTeamResponse();
    const activeMember = {
      id: 'user-id-2',
      alumniSinceDate: undefined,
      email: 'H@rdy.io',
      firstName: 'John',
      lastName: 'Doe',
      displayName: 'John Doe',
      role: 'Lead PI (Core Leadership)',
      avatarUrl: undefined,
    } as TeamMember;

    teamResponse.members = [teamResponse.members[0]!, activeMember];
    const publicTeamResponse = getPublicTeamResponse();
    test('Should return a 404 error when the team or members are not found', async () => {
      teamControllerMock.fetchById.mockRejectedValueOnce(Boom.notFound());

      const response = await supertest(publicApp).get('/public/teams/123');

      expect(response.status).toBe(404);
    });

    test('Should call the controller with the right parameters', async () => {
      const teamId = 'abc123';

      teamControllerMock.fetchById.mockResolvedValueOnce(teamResponse);

      await supertest(publicApp).get(`/public/teams/${teamId}`);

      expect(teamControllerMock.fetchById).toHaveBeenCalledWith(teamId, {
        showTools: false,
        internalAPI: false,
      });
    });

    test('Should return the result correctly', async () => {
      teamControllerMock.fetchById.mockResolvedValueOnce(teamResponse);

      const response = await supertest(publicApp).get('/public/teams/123');

      expect(response.body).toEqual(publicTeamResponse);
    });

    test('Should return all members as inactive if team is inactive', async () => {
      const inactiveTeam = {
        ...teamResponse,
        inactiveSince: '2020-09-23T20:45:22.000Z',
      };
      teamControllerMock.fetchById.mockResolvedValueOnce(inactiveTeam);

      const response = await supertest(publicApp).get('/public/teams/123');

      expect(response.body).toEqual(
        expect.objectContaining({
          members: [
            expect.objectContaining({
              status: 'Inactive',
            }),
            expect.objectContaining({
              status: 'Inactive',
            }),
          ],
        }),
      );
    });
  });
});
