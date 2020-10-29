import nock from 'nock';
import { APIGatewayProxyResult } from 'aws-lambda';

import { handler } from '../../../src/handlers/teams/fetch';
import { cms } from '../../../src/config';
import { apiGatewayEvent } from '../../helpers/events';
import { identity } from '../../helpers/squidex';
import * as fixtures from './fetch.fixtures';

jest.mock('../../../src/utils/validate-token')

describe('GET /teams', () => {
  beforeAll(() => {
    identity();
  });

  afterEach(() => {
    expect(nock.isDone()).toBe(true);
  });

  test('returns 200 when no teams exist', async () => {
    nock(cms.baseUrl)
      .get(`/api/content/${cms.appName}/teams`)
      .query({
        $orderby: 'data/displayName/iv',
        $top: 8,
        $skip: 8,
      })
      .reply(200, { total: 0, items: [] });

    const result = (await handler(
      apiGatewayEvent({
        httpMethod: 'get',
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
    nock(cms.baseUrl)
      .get(`/api/content/${cms.appName}/teams`)
      .query({
        $top: 8,
        $orderby: 'data/displayName/iv',
        $filter:
          "(contains(data/displayName/iv, 'Cristiano')" +
          " or contains(data/projectTitle/iv, 'Cristiano')" +
          " or contains(data/skills/iv, 'Cristiano'))" +
          ' and' +
          " (contains(data/displayName/iv, 'Ronaldo')" +
          " or contains(data/projectTitle/iv, 'Ronaldo')" +
          " or contains(data/skills/iv, 'Ronaldo'))",
      })
      .reply(200, { total: 1, items: fixtures.teamsResponse.items.slice(0, 1) })
      .get(`/api/content/${cms.appName}/users`)
      .query({
        $filter: "data/teams/iv/id eq 'team-id-1'",
      })
      .reply(200, fixtures.usersResponseTeam1);

    const result = (await handler(
      apiGatewayEvent({
        httpMethod: 'get',
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

  test("returns empty response when resource doesn't exist", async () => {
    nock(cms.baseUrl)
      .get(`/api/content/${cms.appName}/teams`)
      .query({
        $top: 8,
        $orderby: 'data/displayName/iv',
      })
      .reply(404);

    const result = (await handler(
      apiGatewayEvent({
        httpMethod: 'get',
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

  test('returns 200 when teams exist', async () => {
    nock(cms.baseUrl)
      .get(`/api/content/${cms.appName}/teams`)
      .query({
        $top: 8,
        $orderby: 'data/displayName/iv',
      })
      .reply(200, fixtures.teamsResponse)
      .get(`/api/content/${cms.appName}/users`)
      .query({
        $filter: "data/teams/iv/id eq 'team-id-1'",
      })
      .reply(200, fixtures.usersResponseTeam1)
      .get(`/api/content/${cms.appName}/users`)
      .query({
        $filter: "data/teams/iv/id eq 'team-id-2'",
      })
      .reply(200, fixtures.usersResponseTeam2);

    const result = (await handler(
      apiGatewayEvent({
        httpMethod: 'get',
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
