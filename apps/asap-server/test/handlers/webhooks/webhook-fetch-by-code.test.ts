import nock from 'nock';
import { APIGatewayProxyResult } from 'aws-lambda';
import { config } from '@asap-hub/squidex';

import { handler } from '../../../src/handlers/webhooks/webhook-fetch-by-code';
import { apiGatewayEvent } from '../../helpers/events';
import { auth0SharedSecret as secret } from '../../../src/config';
import { identity } from '../../helpers/squidex';
import { buildGraphQLQueryFetchUsers } from '../../../src/controllers/users';
import { fetchUserResponse } from './webhook-fetch-by-code.fixtures';

describe('POST /webhook/users/{code} - validation', () => {
  test("return 400 when code isn't present", async () => {
    const result = (await handler(
      apiGatewayEvent({
        httpMethod: 'get',
        headers: {
          Authorization: `Basic ${secret}`,
        },
      }),
    )) as APIGatewayProxyResult;

    expect(result.statusCode).toStrictEqual(400);
  });

  test('returns 401 when request is not authorized', async () => {
    const result = (await handler(
      apiGatewayEvent({
        httpMethod: 'get',
        pathParameters: {
          code: 'welcomeCode',
        },
      }),
    )) as APIGatewayProxyResult;

    expect(result.statusCode).toStrictEqual(401);
  });

  test('returns 401 when request is not using Basic Auth', async () => {
    const result = (await handler(
      apiGatewayEvent({
        httpMethod: 'get',
        pathParameters: {
          code: 'welcomeCode',
        },
        headers: {
          Authorization: `Bearer ${secret}`,
        },
      }),
    )) as APIGatewayProxyResult;

    expect(result.statusCode).toStrictEqual(401);
  });

  test('returns 403 when secret doesnt match', async () => {
    const result = (await handler(
      apiGatewayEvent({
        httpMethod: 'get',
        pathParameters: {
          code: 'welcomeCode',
        },
        headers: {
          Authorization: `Basic wrongSecret`,
        },
      }),
    )) as APIGatewayProxyResult;

    expect(result.statusCode).toStrictEqual(403);
  });
});

describe('GET /webhook/users/{code}', () => {
  beforeAll(() => {
    identity();
  });

  afterEach(() => {
    expect(nock.isDone()).toBe(true);
  });

  test("returns 403 when code doesn't exist", async () => {
    nock(config.baseUrl)
      .post(`/api/content/${config.appName}/graphql`, {
        query: buildGraphQLQueryFetchUsers(
          `data/connections/iv/code eq 'notFound'`,
          1,
          0,
        ),
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
        pathParameters: {
          code: 'notFound',
        },
        headers: {
          Authorization: `Basic ${secret}`,
        },
      }),
    )) as APIGatewayProxyResult;

    expect(result.statusCode).toStrictEqual(403);
  });

  test('returns 200 when user exists', async () => {
    nock(config.baseUrl)
      .post(`/api/content/${config.appName}/graphql`, {
        query: buildGraphQLQueryFetchUsers(
          `data/connections/iv/code eq 'welcomeCode'`,
          1,
          0,
        ),
      })
      .reply(200, {
        data: {
          queryUsersContentsWithTotal: fetchUserResponse,
        },
      });

    const result = (await handler(
      apiGatewayEvent({
        httpMethod: 'get',
        pathParameters: {
          code: 'welcomeCode',
        },
        headers: {
          Authorization: `Basic ${secret}`,
        },
      }),
    )) as APIGatewayProxyResult;

    expect(result.statusCode).toStrictEqual(200);
  });
});
