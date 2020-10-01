import nock from 'nock';
import { APIGatewayProxyResult } from 'aws-lambda';
import { config as authConfig } from '@asap-hub/auth';

import { handler } from '../../../src/handlers/teams/fetch-by-id';
import { cms } from '../../../src/config';
import { apiGatewayEvent } from '../../helpers/events';
import { identity } from '../../helpers/squidex';
import { teamsResponse } from './fetch.fixtures';

describe('GET /teams/{id} - validations', () => {
  test('return 401 when Authentication header is not set', async () => {
    const result = (await handler(
      apiGatewayEvent({
        httpMethod: 'get',
        pathParameters: {
          id: 'teamId',
        },
      }),
    )) as APIGatewayProxyResult;

    expect(result.statusCode).toStrictEqual(401);
  });

  test('returns 401 when method is not bearer', async () => {
    const result = (await handler(
      apiGatewayEvent({
        httpMethod: 'get',
        headers: {
          Authorization: `Basic token`,
        },
        pathParameters: {
          id: 'teamId',
        },
      }),
    )) as APIGatewayProxyResult;

    expect(result.statusCode).toStrictEqual(401);
  });

  test('returns 403 when Auth0 fails to verify token', async () => {
    nock(`https://${authConfig.domain}`).get('/userinfo').reply(404);

    const result = (await handler(
      apiGatewayEvent({
        httpMethod: 'get',
        headers: {
          Authorization: `Bearer token`,
        },
        pathParameters: {
          id: 'teamId',
        },
      }),
    )) as APIGatewayProxyResult;

    expect(result.statusCode).toStrictEqual(403);
  });

  test('returns 403 when Auth0 is unavailable', async () => {
    nock(`https://${authConfig.domain}`).get('/userinfo').reply(500);

    const result = (await handler(
      apiGatewayEvent({
        httpMethod: 'get',
        headers: {
          Authorization: `Bearer token`,
        },
        pathParameters: {
          id: 'teamId',
        },
      }),
    )) as APIGatewayProxyResult;

    expect(result.statusCode).toStrictEqual(403);
  });
});

describe('GET /teams/{id}', () => {
  beforeAll(() => {
    identity();
  });

  afterEach(() => {
    expect(nock.isDone()).toBe(true);
  });

  test("returns 404 when team doesn't exist", async () => {
    nock(`https://${authConfig.domain}`).get('/userinfo').reply(200);
    nock(cms.baseUrl)
      .get(`/api/content/${cms.appName}/teams/NotFound`)
      .reply(404);

    const result = (await handler(
      apiGatewayEvent({
        httpMethod: 'get',
        headers: {
          Authorization: `Bearer token`,
        },
        pathParameters: {
          id: 'NotFound',
        },
      }),
    )) as APIGatewayProxyResult;

    expect(result.statusCode).toStrictEqual(404);
  });

  test('returns 200 when team exists', async () => {
    nock(`https://${authConfig.domain}`).get('/userinfo').reply(200);
    nock(cms.baseUrl)
      .get(`/api/content/${cms.appName}/teams/teamId`)
      .reply(200, teamsResponse.items[0]);

    const result = (await handler(
      apiGatewayEvent({
        httpMethod: 'get',
        headers: {
          Authorization: `Bearer token`,
        },
        pathParameters: {
          id: 'teamId',
        },
      }),
    )) as APIGatewayProxyResult;

    expect(result.statusCode).toStrictEqual(200);
  });
});
