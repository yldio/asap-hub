import nock from 'nock';
import { APIGatewayProxyResult } from 'aws-lambda';

import { handler } from '../../../src/handlers/webhooks/webhook-fetch-by-code';
import { apiGatewayEvent } from '../../helpers/events';
import { auth0SharedSecret as secret, cms } from '../../../src/config';
import { identity } from '../../helpers/squidex';
import fetchUserResponse from './webhook-fetch-by-code.fixtures';

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

describe('POST /webhook/users/{code}', () => {
  beforeAll(() => {
    identity();
  });

  afterEach(() => {
    expect(nock.isDone()).toBe(true);
  });

  test("returns 403 when code doesn't exist", async () => {
    nock(cms.baseUrl)
      .get(`/api/content/${cms.appName}/users`)
      .query({
        $top: 1,
        $filter: `data/connections/iv/code eq 'notFound'`,
      })
      .reply(404);

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
    nock(cms.baseUrl)
      .get(`/api/content/${cms.appName}/users`)
      .query({
        $top: 1,
        $filter: `data/connections/iv/code eq 'welcomeCode'`,
      })
      .reply(200, fetchUserResponse);

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
