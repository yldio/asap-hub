import nock from 'nock';
import Chance from 'chance';

import { APIGatewayProxyResult } from 'aws-lambda';
import { config as authConfig } from '@asap-hub/auth';

import { handler } from '../../../src/handlers/teams/fetch';
import { cms } from '../../../src/config';
import { apiGatewayEvent } from '../../helpers/events';
import { identity } from '../../helpers/squidex';
import * as fixtures from './fetch.fixtures';

const chance = new Chance();

describe('GET /teams', () => {
  beforeAll(() => {
    identity();
  });

  afterEach(() => {
    expect(nock.isDone()).toBe(true);
  });

  test('returns 200 when no teams exist', async () => {
    nock(`https://${authConfig.domain}`).get('/userinfo').reply(200);
    nock(cms.baseUrl)
      .get(`/api/content/${cms.appName}/teams`)
      .query({
        q: JSON.stringify({
          take: 8,
          skip: 0,
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

  test("returns empty response when resource doesn't exist", async () => {
    nock(`https://${authConfig.domain}`).get('/userinfo').reply(200);
    nock(cms.baseUrl)
      .get(`/api/content/${cms.appName}/teams`)
      .query({
        q: JSON.stringify({
          take: 8,
          skip: 0,
          sort: [{ path: 'data.displayName.iv' }],
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

  test('returns 200 when teams exist', async () => {
    nock(`https://${authConfig.domain}`).get('/userinfo').reply(200);
    nock(cms.baseUrl)
      .get(`/api/content/${cms.appName}/teams`)
      .query({
        q: JSON.stringify({
          take: 8,
          skip: 0,
          sort: [{ path: 'data.displayName.iv' }],
        }),
      })
      .reply(200, fixtures.teamsResponse)
      .get(`/api/content/${cms.appName}/users`)
      .query({
        $filter: "data/teams/iv/id eq 'team-id-1'",
      })
      .reply(200, fixtures.usersResponseTeam1)
      .get(`/api/content/${cms.appName}/users`)
      .query({
        $filter: "data/teams/iv/id eq 'team-id-2'",
      })
      .reply(200, fixtures.usersResponseTeam2);

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
