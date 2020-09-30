import nock from 'nock';
import { APIGatewayProxyResult } from 'aws-lambda';
import { Squidex } from '@asap-hub/services-common';
import { config as authConfig } from '@asap-hub/auth';
import { UserResponse } from '@asap-hub/model';

import { CMSTeam, CMSUser } from '../../../src/entities';
import { handler } from '../../../src/handlers/teams/fetch-by-id';
import { apiGatewayEvent } from '../../helpers/events';
import { createUserOnTeam } from '../../helpers/create-user';
import { createRandomTeam } from '../../helpers/teams';

const teams = new Squidex<CMSTeam>('teams');
const users = new Squidex<CMSUser>('users');
describe('GET /teams/{id}', () => {
  let user: UserResponse;
  let team: CMSTeam;

  beforeAll(async () => {
    team = await createRandomTeam();
    const { connections, ...res } = await createUserOnTeam(team);
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

  test('returns 200 when users exist', async () => {
    nock(`https://${authConfig.domain}`).get('/userinfo').reply(200);
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
        email: expect.any(String),
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
