import nock from 'nock';
import { APIGatewayProxyResult } from 'aws-lambda';
import { Squidex, RestTeam, RestUser } from '@asap-hub/squidex';
import { UserResponse } from '@asap-hub/model';

import { handler } from '../../../src/handlers/teams/fetch-by-id';
import { apiGatewayEvent } from '../../helpers/events';
import { createUserOnTeam } from '../../helpers/users';
import { createRandomTeam } from '../../helpers/teams';

jest.mock('../../../src/utils/validate-token');

const teams = new Squidex<RestTeam>('teams');
const users = new Squidex<RestUser>('users');

describe('GET /teams/{id}', () => {
  let user: UserResponse;
  let team: RestTeam;

  beforeAll(async () => {
    team = await createRandomTeam();
    const { connections, ...res } = await createUserOnTeam(
      team,
      'Project Manager',
    );
    user = res;
  });

  afterEach(() => {
    nock.cleanAll();
  });

  afterAll(async () => {
    if (user?.id) {
      await users.delete(user.id);
    }
    if (team?.id) {
      await teams.delete(team.id);
    }
  });

  test('returns 200 when teams exist', async () => {
    const result = (await handler(
      apiGatewayEvent({
        httpMethod: 'get',
        headers: {
          Authorization: `Bearer Token`,
        },
        pathParameters: {
          id: team.id,
        },
      }),
    )) as APIGatewayProxyResult;

    const body = JSON.parse(result.body);
    expect(result.statusCode).toStrictEqual(200);
    expect(body).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        displayName: expect.any(String),
        applicationNumber: expect.any(String),
        pointOfContact: expect.objectContaining({
          id: expect.any(String),
          displayName: expect.any(String),
          firstName: expect.any(String),
          lastName: expect.any(String),
          email: expect.any(String),
          role: expect.any(String),
        }),
        projectTitle: expect.any(String),
        projectSummary: expect.any(String),
      }),
    );
    expect(body.members[0]).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        firstName: expect.any(String),
        lastName: expect.any(String),
        displayName: expect.any(String),
        role: expect.any(String),
      }),
    );
  });
});
