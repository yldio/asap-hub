import nock from 'nock';
import Chance from 'chance';

import { APIGatewayProxyResult } from 'aws-lambda';

import { config as authConfig } from '@asap-hub/auth';
import { handler } from '../../../src/handlers/users/fetch';
import { cms } from '../../../src/config';
import { apiGatewayEvent } from '../../helpers/events';
import { createRandomUser } from '../../helpers/create-user';

const chance = new Chance();

describe('GET /users', () => {
  afterEach(() => nock.cleanAll());

  test('returns 200 when no users exist', async () => {
    nock(`https://${authConfig.domain}`).get('/userinfo').reply(200);

    nock(cms.baseUrl)
      .post('/identity-server/connect/token')
      .reply(200, { access_token: 'token' })
      .get(`/api/content/${cms.appName}/users`)
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
    )) as APIGatewayProxyResult;

    expect(result.statusCode).toStrictEqual(200);
    expect(result.body).toBeDefined();
    expect(result.body).toStrictEqual('[]');
  });

  test('returns 200 when users exist', async () => {
    nock(`https://${authConfig.domain}`).get('/userinfo').reply(200);
    await Promise.all(
      new Array(3).fill(async () => await createRandomUser({})),
    );

    const result = (await handler(
      apiGatewayEvent({
        httpMethod: 'get',
        headers: {
          Authorization: `Bearer ${chance.string()}`,
        },
      }),
    )) as APIGatewayProxyResult;

    expect(result.statusCode).toStrictEqual(200);
    expect(result.body).toBeDefined();
    expect(result.body.length).toBeGreaterThan(0);
  });
});
