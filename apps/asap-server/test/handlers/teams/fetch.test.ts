import nock from 'nock';
import Chance from 'chance';

import { APIGatewayProxyResult } from 'aws-lambda';
import { config as authConfig } from '@asap-hub/auth';

import { handler } from '../../../src/handlers/teams/fetch';
import { cms } from '../../../src/config';
import { apiGatewayEvent } from '../../helpers/events';
import { createRandomTeam } from '../../helpers/teams';

const chance = new Chance();

describe('GET /teams', () => {
  afterEach(() => nock.cleanAll());

  test('returns 200 when no teams exist', async () => {
    nock(`https://${authConfig.domain}`).get('/userinfo').reply(200);

    nock(cms.baseUrl)
      .post('/identity-server/connect/token')
      .reply(200, { access_token: 'token' })
      .get(`/api/content/${cms.appName}/teams`)
      .query({
        q: JSON.stringify({
          take: 30,
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
      null,
      null,
    )) as APIGatewayProxyResult;

    expect(result.statusCode).toStrictEqual(200);
    expect(result.body).toBeDefined();
    expect(result.body).toStrictEqual('[]');
  });

  test("returns empty response when resource doesn't exist", async () => {
    nock(`https://${authConfig.domain}`).get('/userinfo').reply(200);

    nock(cms.baseUrl)
      .post('/identity-server/connect/token')
      .reply(200, { access_token: 'token' })
      .get(`/api/content/${cms.appName}/teams`)
      .query({
        q: JSON.stringify({
          take: 30,
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
      null,
      null,
    )) as APIGatewayProxyResult;

    expect(result.statusCode).toStrictEqual(200);
    expect(result.body).toBeDefined();
    expect(JSON.parse(result.body).length).toEqual(0);
  });

  test('returns 200 when teams exist', async () => {
    nock(`https://${authConfig.domain}`).get('/userinfo').reply(200);

    await Promise.all(new Array(3).fill(async () => await createRandomTeam()));

    const result = (await handler(
      apiGatewayEvent({
        httpMethod: 'get',
        headers: {
          Authorization: `Bearer ${chance.string()}`,
        },
      }),
      null,
      null,
    )) as APIGatewayProxyResult;

    expect(result.statusCode).toStrictEqual(200);
    expect(result.body).toBeDefined();
    expect(JSON.parse(result.body).length).toBeGreaterThan(0);
  });
});
