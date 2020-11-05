import nock from 'nock';
import { APIGatewayProxyResult } from 'aws-lambda';
import { config } from '@asap-hub/squidex';

import { buildGraphQLQueryFetchUsers } from '../../../src/controllers/users';
import { handler } from '../../../src/handlers/users/fetch';
import { apiGatewayEvent } from '../../helpers/events';
import { identity } from '../../helpers/squidex';
import * as fixtures from './fetch.fixtures';

jest.mock('../../../src/utils/validate-token');

describe('GET /users', () => {
  beforeAll(() => {
    identity();
  });

  afterEach(() => {
    expect(nock.isDone()).toBe(true);
  });

  test('returns 200 when no users exist', async () => {
    nock(config.baseUrl)
      .post(`/api/content/${config.appName}/graphql`, {
        query: buildGraphQLQueryFetchUsers("data/role/iv ne 'Hidden'"),
      })
      .reply(200, {
        data: {
          queryUsersContentsWithTotal: {
            total: 0,
            items: [],
          },
        },
      });

    const result = (await handler(
      apiGatewayEvent({
        httpMethod: 'get',
        headers: {
          Authorization: `Bearer token`,
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

  test('returns 200 when searching users by name - should allow filter as string', async () => {
    const filter =
      "data/teams/iv/role eq 'Lead PI (Core Leadership)' and" +
      " (data/role/iv ne 'Hidden' and" +
      " (contains(data/displayName/iv, 'first')" +
      " or contains(data/firstName/iv, 'first')" +
      " or contains(data/institution/iv, 'first')" +
      " or contains(data/skills/iv, 'first'))" +
      ' and' +
      " (contains(data/displayName/iv, 'last')" +
      " or contains(data/firstName/iv, 'last')" +
      " or contains(data/institution/iv, 'last')" +
      " or contains(data/skills/iv, 'last')))";

    nock(config.baseUrl)
      .post(`/api/content/${config.appName}/graphql`, {
        query: buildGraphQLQueryFetchUsers(filter),
      })
      .reply(200, fixtures.response);

    const result = (await handler(
      apiGatewayEvent({
        httpMethod: 'get',
        queryStringParameters: {
          search: 'first last',
          filter: 'Lead PI (Core Leadership)',
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

  test('returns 200 when searching users by name', async () => {
    const filter =
      "data/teams/iv/role eq 'Lead PI (Core Leadership)' or" +
      " data/teams/iv/role eq 'anotherFilter' and" +
      " (data/role/iv ne 'Hidden' and" +
      " (contains(data/displayName/iv, 'first')" +
      " or contains(data/firstName/iv, 'first')" +
      " or contains(data/institution/iv, 'first')" +
      " or contains(data/skills/iv, 'first'))" +
      ' and' +
      " (contains(data/displayName/iv, 'last')" +
      " or contains(data/firstName/iv, 'last')" +
      " or contains(data/institution/iv, 'last')" +
      " or contains(data/skills/iv, 'last')))";

    nock(config.baseUrl)
      .post(`/api/content/${config.appName}/graphql`, {
        query: buildGraphQLQueryFetchUsers(filter),
      })
      .reply(200, fixtures.response);

    const result = (await handler(
      apiGatewayEvent({
        httpMethod: 'get',
        queryStringParameters: {
          search: 'first last',
          filter: 'Lead PI (Core Leadership),anotherFilter',
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

  test('returns 200 with the results from the requested page', async () => {
    nock(config.baseUrl)
      .post(`/api/content/${config.appName}/graphql`, {
        query: buildGraphQLQueryFetchUsers("data/role/iv ne 'Hidden'", 8, 8),
      })
      .reply(200, {
        data: {
          queryUsersContentsWithTotal: {
            total: 0,
            items: [],
          },
        },
      });

    const result = (await handler(
      apiGatewayEvent({
        httpMethod: 'get',
        headers: {
          Authorization: `Bearer token`,
        },
        queryStringParameters: {
          take: '8',
          skip: '8',
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
});
