import nock from 'nock';
import { config } from '@asap-hub/squidex';

import { buildGraphQLQueryFetchGroups } from '../../../src/controllers/groups';
import { apiGatewayEvent } from '../../helpers/events';
import { identity } from '../../helpers/squidex';
import { handler } from '../../../src/handlers/groups/fetch-by-user-id';
import { APIGatewayProxyResult } from 'aws-lambda';
import * as fixtures from './fetch.fixtures';

jest.mock('../../../src/utils/validate-token');

describe('GET /users/{id}/groups', () => {
  beforeAll(() => {
    identity();
  });

  afterEach(() => {
    expect(nock.isDone()).toBe(true);
  });

  test('returns 200 when no groups for the user exist', async () => {
    const userUUID = 'eb531b6e-195c-46e2-b347-58fb86715033';
    const userFilter = `data/leaders/iv/user eq '${userUUID}'`;

    // same as in the mocked token
    const teamFilter = `data/teams/iv in ['team-id-1', 'team-id-3']`;

    nock(config.baseUrl)
      .post(`/api/content/${config.appName}/graphql`, {
        query: buildGraphQLQueryFetchGroups(userFilter),
      })
      .reply(200, {
        data: {
          queryGroupsContentsWithTotal: {
            total: 0,
            items: [],
          },
        },
      })
      .post(`/api/content/${config.appName}/graphql`, {
        query: buildGraphQLQueryFetchGroups(teamFilter),
      })
      .reply(200, {
        data: {
          queryGroupsContentsWithTotal: {
            total: 0,
            items: [],
          },
        },
      });

    const result = (await handler(
      apiGatewayEvent({
        pathParameters: {
          id: userUUID,
        },
        headers: {
          Authorization: 'Bearer token',
        },
      }),
    )) as APIGatewayProxyResult;

    const body = JSON.parse(result.body);

    expect(result.statusCode).toStrictEqual(200);
    expect(result.body).toBeDefined();
    expect(body).toStrictEqual({
      items: [],
      total: 0,
    });
  });

  test('returns 200 when fetching user groups - dedups groups reponse', async () => {
    const userUUID = 'user-id-1';
    const userFilter = `data/leaders/iv/user eq '${userUUID}'`;

    // same as in the mocked token
    const teamFilter = `data/teams/iv in ['team-id-1', 'team-id-3']`;

    // same response since the user is group leader and member a team
    nock(config.baseUrl)
      .post(`/api/content/${config.appName}/graphql`, {
        query: buildGraphQLQueryFetchGroups(userFilter),
      })
      .reply(200, fixtures.response)
      .post(`/api/content/${config.appName}/graphql`, {
        query: buildGraphQLQueryFetchGroups(teamFilter),
      })
      .reply(200, fixtures.response);

    const result = (await handler(
      apiGatewayEvent({
        pathParameters: {
          id: userUUID,
        },
        headers: {
          Authorization: 'Bearer token',
        },
      }),
    )) as APIGatewayProxyResult;

    const body = JSON.parse(result.body);
    expect(result.statusCode).toStrictEqual(200);
    expect(body).toStrictEqual(fixtures.expectation);
  });
});
