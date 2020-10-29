import nock from 'nock';

import { APIGatewayProxyResult } from 'aws-lambda';

import { handler } from '../../../src/handlers/news-and-events/fetch';
import { cms } from '../../../src/config';
import { apiGatewayEvent } from '../../helpers/events';
import { identity } from '../../helpers/squidex';
import * as fixtures from './fetch.fixtures';

jest.mock('../../../src/utils/validate-token');

describe('GET /news-and-events', () => {
  beforeAll(() => {
    identity();
  });

  afterEach(() => {
    expect(nock.isDone()).toBe(true);
  });

  test('returns 200 when no news and events exist', async () => {
    nock(cms.baseUrl)
      .get(`/api/content/${cms.appName}/news-and-events`)
      .query({
        q: JSON.stringify({
          take: 8,
          filter: { path: 'data.type.iv', op: 'ne', value: 'Training' },
          sort: [{ order: 'descending', path: 'created' }],
        }),
      })
      .reply(200, { total: 0, items: [] });

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

  test("returns empty response when resource doesn't exist", async () => {
    nock(cms.baseUrl)
      .get(`/api/content/${cms.appName}/news-and-events`)
      .query({
        q: JSON.stringify({
          take: 8,
          filter: { path: 'data.type.iv', op: 'ne', value: 'Training' },
          sort: [{ order: 'descending', path: 'created' }],
        }),
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

  test('returns 200 when news and events exist', async () => {
    nock(cms.baseUrl)
      .get(`/api/content/${cms.appName}/news-and-events`)
      .query({
        q: JSON.stringify({
          take: 8,
          filter: { path: 'data.type.iv', op: 'ne', value: 'Training' },
          sort: [{ order: 'descending', path: 'created' }],
        }),
      })
      .reply(200, fixtures.newsAndEventsResponse);

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
