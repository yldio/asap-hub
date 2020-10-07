import nock from 'nock';
import { APIGatewayProxyResult } from 'aws-lambda';
import { config as authConfig } from '@asap-hub/auth';

import { cms } from '../../../src/config';
import { identity } from '../../helpers/squidex';
import { handler } from '../../../src/handlers/content/fetch-by-slug';
import { apiGatewayEvent } from '../../helpers/events';

describe('GET /content/{content}/{slug} - validation', () => {
  test('return 401 when Authentication header is not set', async () => {
    const result = (await handler(
      apiGatewayEvent({
        httpMethod: 'get',
        pathParameters: {
          content: 'news',
          slug: 'exists-in-dev',
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
          content: 'news',
          slug: 'exists-in-dev',
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
          content: 'news',
          slug: 'exists-in-dev',
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
          content: 'news',
          slug: 'exists-in-dev',
        },
      }),
    )) as APIGatewayProxyResult;

    expect(result.statusCode).toStrictEqual(403);
  });
});

describe('GET /content/{content}/{slug}', () => {
  beforeAll(() => {
    identity();
  });

  afterEach(() => {
    expect(nock.isDone()).toBe(true);
  });

  test('returns 404 when no content is found', async () => {
    nock(`https://${authConfig.domain}`).get('/userinfo').reply(200);

    nock(cms.baseUrl)
      .get(`/api/content/${cms.appName}/news`)
      .query({
        q: JSON.stringify({
          take: 1,
          filter: {
            path: 'data.slug.iv',
            op: 'eq',
            value: 'not-found',
          },
        }),
      })
      .reply(404);

    const result = (await handler(
      apiGatewayEvent({
        httpMethod: 'get',
        headers: {
          Authorization: `Bearer token`,
        },
        pathParameters: {
          content: 'news',
          slug: 'not-found',
        },
      }),
    )) as APIGatewayProxyResult;

    expect(result.statusCode).toStrictEqual(404);
  });

  test('returns 200 when content is found', async () => {
    nock(`https://${authConfig.domain}`).get('/userinfo').reply(200);
    nock(cms.baseUrl)
      .get(`/api/content/${cms.appName}/news`)
      .query({
        q: JSON.stringify({
          take: 1,
          filter: {
            path: 'data.slug.iv',
            op: 'eq',
            value: 'exists-in-dev',
          },
        }),
      })
      .reply(200, {
        total: 1,
        items: [
          {
            data: {
              slug: {
                iv: 'exists-in-dev',
              },
              title: {
                iv: 'Exists in Dev',
              },
            },
          },
        ],
      });

    const result = (await handler(
      apiGatewayEvent({
        httpMethod: 'get',
        headers: {
          Authorization: `Bearer token`,
        },
        pathParameters: {
          content: 'news',
          slug: 'exists-in-dev',
        },
      }),
    )) as APIGatewayProxyResult;

    expect(result.statusCode).toStrictEqual(200);
    expect(JSON.parse(result.body).slug).toStrictEqual('exists-in-dev');
  });
});
