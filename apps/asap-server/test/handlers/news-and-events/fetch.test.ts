import nock from 'nock';
import Chance from 'chance';

import { APIGatewayProxyResult } from 'aws-lambda';
import { config as authConfig } from '@asap-hub/auth';

import { handler } from '../../../src/handlers/news-and-events/fetch';
import { cms } from '../../../src/config';
import { apiGatewayEvent } from '../../helpers/events';
import { identity } from '../../helpers/squidex';
import * as fixtures from './fetch.fixtures';
import { NewsAndEventsResponse } from '@asap-hub/model';

const chance = new Chance();

describe('GET /news-and-events', () => {
  beforeAll(() => {
    identity();
  });

  afterEach(() => {
    expect(nock.isDone()).toBe(true);
  });

  test('returns 200 when no news and events exist', async () => {
    nock(`https://${authConfig.domain}`).get('/userinfo').reply(200);
    nock(cms.baseUrl)
      .get(`/api/content/${cms.appName}/news-and-events`)
      .query({
        q: JSON.stringify({
          take: 8,
          sort: [{ order: 'descending', path: 'created' }],
        }),
      })
      .reply(200, { total: 0, items: [] });

    const result = (await handler(
      apiGatewayEvent({
        httpMethod: 'get',
        headers: {
          Authorization: `Bearer ${chance.string()}`,
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
    nock(`https://${authConfig.domain}`).get('/userinfo').reply(200);
    nock(cms.baseUrl)
      .get(`/api/content/${cms.appName}/news-and-events`)
      .query({
        q: JSON.stringify({
          take: 8,
          sort: [{ order: 'descending', path: 'created' }],
        }),
      })
      .reply(404);

    const result = (await handler(
      apiGatewayEvent({
        httpMethod: 'get',
        headers: {
          Authorization: `Bearer ${chance.string()}`,
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
    nock(`https://${authConfig.domain}`).get('/userinfo').reply(200);
    nock(cms.baseUrl)
      .get(`/api/content/${cms.appName}/news-and-events`)
      .query({
        q: JSON.stringify({
          take: 8,
          sort: [{ order: 'descending', path: 'created' }],
        }),
      })
      .reply(200, fixtures.newsAndEventsResponse);

    const result = (await handler(
      apiGatewayEvent({
        httpMethod: 'get',
        headers: {
          Authorization: `Bearer ${chance.string()}`,
        },
      }),
    )) as APIGatewayProxyResult;

    const body = JSON.parse(result.body);
    expect(result.statusCode).toStrictEqual(200);
    expect({
      ...body,
      items: body.items.map((i: NewsAndEventsResponse) => ({
        ...i,
        created: new Date(i.created),
      })),
    }).toStrictEqual(fixtures.expectation);
  });
});
