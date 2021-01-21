import nock from 'nock';
import { APIGatewayProxyResult } from 'aws-lambda';
import { config } from '@asap-hub/squidex';

import { handler } from '../../../src/handlers/teams/fetch';
import { buildGraphQLQueryFetchTeams } from '../../../src/controllers/teams';
import { apiGatewayEvent } from '../../helpers/events';
import { identity } from '../../helpers/squidex';
import * as fixtures from './fetch.fixtures';

jest.mock('../../../src/utils/validate-token');

describe('GET /teams', () => {
  beforeAll(() => {
    identity();
  });

  afterEach(() => {
    expect(nock.isDone()).toBe(true);
  });

  test('returns 200 when no teams exist', async () => {
    nock(config.baseUrl)
      .post(`/api/content/${config.appName}/graphql`, {
        query: buildGraphQLQueryFetchTeams('', 8, 8),
      })
      .reply(200, {
        data: {
          queryTeamsContentsWithTotal: {
            total: 0,
            items: [],
          },
        },
      });

    const result = (await handler(
      apiGatewayEvent({
        queryStringParameters: {
          take: '8',
          skip: '8',
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

  test('returns 200 when searching teams by name', async () => {
    const searchQ =
      "(contains(data/displayName/iv, 'Cristiano')" +
      " or contains(data/projectTitle/iv, 'Cristiano')" +
      " or contains(data/skills/iv, 'Cristiano'))" +
      ' and' +
      " (contains(data/displayName/iv, 'Ronaldo')" +
      " or contains(data/projectTitle/iv, 'Ronaldo')" +
      " or contains(data/skills/iv, 'Ronaldo'))";

    nock(config.baseUrl)
      .post(`/api/content/${config.appName}/graphql`, {
        query: buildGraphQLQueryFetchTeams(searchQ),
      })
      .reply(200, fixtures.graphQlTeamsResponseSingle)
      .get(`/api/content/${config.appName}/users`)
      .query({
        $filter: "data/teams/iv/id eq 'team-id-1'",
      })
      .reply(200, fixtures.usersResponseTeam1);

    const result = (await handler(
      apiGatewayEvent({
        queryStringParameters: {
          search: 'Cristiano Ronaldo',
        },
        headers: {
          Authorization: 'Bearer token',
        },
      }),
    )) as APIGatewayProxyResult;

    const body = JSON.parse(result.body);
    expect(result.statusCode).toStrictEqual(200);
    expect(body).toStrictEqual({
      total: 1,
      items: fixtures.expectation.items.slice(0, 1),
    });
  });

  test('returns 200 when teams exist', async () => {
    nock(config.baseUrl)
      .post(`/api/content/${config.appName}/graphql`, {
        query: buildGraphQLQueryFetchTeams(),
      })
      .reply(200, fixtures.graphQlTeamsResponse)
      .get(`/api/content/${config.appName}/users`)
      .query({
        $filter: "data/teams/iv/id eq 'team-id-1'",
      })
      .reply(200, fixtures.usersResponseTeam1)
      .get(`/api/content/${config.appName}/users`)
      .query({
        $filter: "data/teams/iv/id eq 'team-id-2'",
      })
      .reply(200, fixtures.usersResponseTeam2)
      .get(`/api/content/${config.appName}/users`)
      .query({
        $filter: "data/teams/iv/id eq 'team-id-3'",
      })
      .reply(200, fixtures.usersResponseTeam3);

    const result = (await handler(
      apiGatewayEvent({
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
