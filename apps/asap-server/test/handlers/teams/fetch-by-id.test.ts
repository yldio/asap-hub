import nock from 'nock';
import { APIGatewayProxyResult } from 'aws-lambda';
import { config } from '@asap-hub/squidex';

import { handler } from '../../../src/handlers/teams/fetch-by-id';
import { apiGatewayEvent } from '../../helpers/events';
import { identity } from '../../helpers/squidex';
import { buildGraphQLQueryFetchTeam } from '../../../src/controllers/teams';
import { fetchTeamByIdExpectation, fetchByIdUserResponse, graphQlTeamResponse } from "../../fixtures/teams.fixtures";

jest.mock('../../../src/utils/validate-token');

describe('GET /teams/{id}', () => {
  beforeAll(() => {
    identity();
  });

  afterEach(() => {
    expect(nock.isDone()).toBe(true);
  });

  test("returns 404 when team doesn't exist", async () => {
    nock(config.baseUrl)
      .post(`/api/content/${config.appName}/graphql`, {
        query: buildGraphQLQueryFetchTeam('not-found'),
      })
      .reply(200, {
        data: {
          findTeamsContent: null,
        },
      });

    const result = (await handler(
      apiGatewayEvent({
        headers: {
          Authorization: `Bearer token`,
        },
        pathParameters: {
          id: 'not-found',
        },
      }),
    )) as APIGatewayProxyResult;

    expect(result.statusCode).toStrictEqual(404);
  });

  test('returns team even when members return 404', async () => {
    nock(config.baseUrl)
      .post(`/api/content/${config.appName}/graphql`, {
        query: buildGraphQLQueryFetchTeam('team-id-1'),
      })
      .reply(200, graphQlTeamResponse)
      .get(`/api/content/${config.appName}/users`)
      .query({
        $filter: "data/teams/iv/id eq 'team-id-1'",
      })
      .reply(404);

    const result = (await handler(
      apiGatewayEvent({
        headers: {
          Authorization: `Bearer token`,
        },
        pathParameters: {
          id: 'team-id-1',
        },
      }),
    )) as APIGatewayProxyResult;

    const body = JSON.parse(result.body);
    expect(result.statusCode).toStrictEqual(200);
    expect(body).toStrictEqual({ ...fetchTeamByIdExpectation, members: [] });
  });

  test('returns team even when has no members', async () => {
    nock(config.baseUrl)
      .post(`/api/content/${config.appName}/graphql`, {
        query: buildGraphQLQueryFetchTeam('team-id-1'),
      })
      .reply(200, graphQlTeamResponse)
      .get(`/api/content/${config.appName}/users`)
      .query({
        $filter: "data/teams/iv/id eq 'team-id-1'",
      })
      .reply(200, { total: 0, items: [] });

    const result = (await handler(
      apiGatewayEvent({
        headers: {
          Authorization: `Bearer token`,
        },
        pathParameters: {
          id: 'team-id-1',
        },
      }),
    )) as APIGatewayProxyResult;

    const body = JSON.parse(result.body);
    expect(result.statusCode).toStrictEqual(200);
    expect(body).toStrictEqual({ ...fetchTeamByIdExpectation, members: [] });
  });

  test('returns 200 when team exists', async () => {
    nock(config.baseUrl)
      .post(`/api/content/${config.appName}/graphql`, {
        query: buildGraphQLQueryFetchTeam('team-id-1'),
      })
      .reply(200, graphQlTeamResponse)
      .get(`/api/content/${config.appName}/users`)
      .query({
        $filter: "data/teams/iv/id eq 'team-id-1'",
      })
      .reply(200, fetchByIdUserResponse);

    const result = (await handler(
      apiGatewayEvent({
        headers: {
          Authorization: `Bearer token`,
        },
        pathParameters: {
          id: 'team-id-1',
        },
      }),
    )) as APIGatewayProxyResult;

    const body = JSON.parse(result.body);
    expect(result.statusCode).toStrictEqual(200);
    expect(body).toStrictEqual(fetchTeamByIdExpectation);
  });
});
