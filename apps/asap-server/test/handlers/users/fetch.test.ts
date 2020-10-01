import nock from 'nock';
import Chance from 'chance';

import { APIGatewayProxyResult } from 'aws-lambda';

import { config as authConfig } from '@asap-hub/auth';

import { handler } from '../../../src/handlers/users/fetch';
import { cms } from '../../../src/config';
import { apiGatewayEvent } from '../../helpers/events';
import { identity } from '../../helpers/squidex';
import * as fixtures from './fetch.fixtures';

const chance = new Chance();

describe('GET /users', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  afterAll(() => {
    expect(nock.isDone()).toBe(true);
  });

  test('returns 200 when no users exist', async () => {
    nock(`https://${authConfig.domain}`).get('/userinfo').reply(200);
    identity()
      .get(`/api/content/${cms.appName}/users`)
      .query({
        q: JSON.stringify({
          take: 8,
          sort: [{ path: 'data.displayName.iv' }],
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

  test('returns 200 with the results from the requested page', async () => {
    nock(`https://${authConfig.domain}`).get('/userinfo').reply(200);
    identity()
      .get(`/api/content/${cms.appName}/users`)
      .query({
        q: JSON.stringify({
          take: 8,
          skip: 8,
          sort: [{ path: 'data.displayName.iv' }],
        }),
      })
      .reply(200, { total: 0, items: [] });

    const result = (await handler(
      apiGatewayEvent({
        httpMethod: 'get',
        headers: {
          Authorization: `Bearer ${chance.string()}`,
        },
        queryStringParameters: {
          take: 8,
          skip: 8,
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

  test('returns 200 when users exist', async () => {
    nock(`https://${authConfig.domain}`).get('/userinfo').reply(200);
    identity()
      .get(`/api/content/${cms.appName}/users`)
      .query({
        q: JSON.stringify({
          take: 8,
          sort: [{ path: 'data.displayName.iv' }],
        }),
      })
      .reply(200, fixtures.response);

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
    expect(body).toStrictEqual(fixtures.expectation);
  });
});
