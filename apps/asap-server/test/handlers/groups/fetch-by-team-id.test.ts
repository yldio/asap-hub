import nock from 'nock';
import { config } from '@asap-hub/squidex';

import { buildGraphQLQueryFetchGroups } from '../../../src/controllers/groups';
import { apiGatewayEvent } from '../../helpers/events';
import { identity } from '../../helpers/squidex';
import { handler } from '../../../src/handlers/groups/fetch-by-team-id';
import { APIGatewayProxyResult } from 'aws-lambda';
import * as fixtures from './fetch.fixtures';

jest.mock('../../../src/utils/validate-token');

describe('GET /teams/{id}/groups', () => {
  beforeAll(() => {
    identity();
  });

  afterEach(() => {
    expect(nock.isDone()).toBe(true);
  });

  test('returns 200 when no groups for the team exist', async () => {
    const teamUUID = 'eb531b6e-195c-46e2-b347-58fb86715033';
    const filter = `data/teams/iv eq '${teamUUID}'`;

    nock(config.baseUrl)
      .post(`/api/content/${config.appName}/graphql`, {
        query: buildGraphQLQueryFetchGroups(filter),
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
        httpMethod: 'get',
        pathParameters: {
          id: teamUUID,
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

  test('returns 200 when fetching team groups', async () => {
    const teamUUID = 'eb531b6e-195c-46e2-b347-58fb86715033';
    const filter = `data/teams/iv eq '${teamUUID}'`;

    nock(config.baseUrl)
      .post(`/api/content/${config.appName}/graphql`, {
        query: buildGraphQLQueryFetchGroups(filter, 36, 11),
      })
      .reply(200, fixtures.response);

    const result = (await handler(
      apiGatewayEvent({
        httpMethod: 'get',
        pathParameters: {
          id: teamUUID,
        },
        queryStringParameters: {
          take: '36',
          skip: '11',
        },
        headers: {
          Authorization: `Bearer token`,
        },
      }),
    )) as APIGatewayProxyResult;

    const body = JSON.parse(result.body);
    expect(result.statusCode).toStrictEqual(200);
    expect(body).toStrictEqual(fixtures.expectation);
  });
});
