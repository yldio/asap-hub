import Chance from 'chance';
import nock from 'nock';
import { APIGatewayProxyResult } from 'aws-lambda';
import { config as authConfig } from '@asap-hub/auth';

import { handler } from '../../src/handlers/welcome';
import { apiGatewayEvent } from '../helpers/events';
import connection from '../../src/utils/connection';

jest.mock('@asap-hub/auth');

const chance = new Chance();
describe('POST /users/{code}', () => {
  afterAll(async () => {
    // close the singleton conneciton to local database
    const c = await connection();
    c.close();
  });

  test("returns 403 when code doesn't exist", async () => {
    const res = (await handler(
      apiGatewayEvent({
        httpMethod: 'post',
        headers: {
          authorization: `Bearer ${chance.string()}`,
        },
        pathParameters: {
          code: chance.string(),
        },
      }),
      null,
      null,
    )) as APIGatewayProxyResult;

    expect(res.statusCode).toStrictEqual(403);
  });

  test('returns 403 when auth0 return an error', async () => {
    nock(`https://${authConfig.domain}`).get('/userinfo').reply(404);

    const code = chance.string();
    const c = await connection();
    await c
      .db()
      .collection('users')
      .insertMany([
        {
          displayName: `${chance.first()} ${chance.last()}`,
          email: chance.email(),
          connections: [code],
        },
      ]);

    const res = (await handler(
      apiGatewayEvent({
        httpMethod: 'post',
        headers: {
          authorization: `Bearer ${chance.string()}`,
        },
        pathParameters: {
          code,
        },
      }),
      null,
      null,
    )) as APIGatewayProxyResult;

    expect(res.statusCode).toStrictEqual(403);

    const user = await c.db().collection('users').findOne({
      connections: code,
    });

    expect(user).toBeDefined();
    expect(user.connections).toHaveLength(1);
  });

  test('returns 403 for invalid code', async () => {
    const response = {
      sub: `google-oauth2|${chance.string()}`,
    };
    nock(`https://${authConfig.domain}`).get('/userinfo').reply(200, response);

    const code = chance.string();
    const c = await connection();
    await c
      .db()
      .collection('users')
      .insertMany([
        {
          displayName: `${chance.first()} ${chance.last()}`,
          email: chance.email(),
          connections: [code],
        },
      ]);

    const res = (await handler(
      apiGatewayEvent({
        httpMethod: 'post',
        headers: {
          authorization: `Bearer ${chance.string()}`,
        },
        pathParameters: {
          code: chance.string(),
        },
      }),
      null,
      null,
    )) as APIGatewayProxyResult;

    expect(res.statusCode).toStrictEqual(403);
  });

  test('returns 202 for valid code and updates the user', async () => {
    const response = {
      sub: `google-oauth2|${chance.string()}`,
    };
    nock(`https://${authConfig.domain}`).get('/userinfo').reply(200, response);

    const code = chance.string();
    const c = await connection();
    await c
      .db()
      .collection('users')
      .insertMany([
        {
          displayName: `${chance.first()} ${chance.last()}`,
          email: chance.email(),
          connections: [code],
        },
      ]);

    const res = (await handler(
      apiGatewayEvent({
        httpMethod: 'post',
        headers: {
          authorization: `Bearer ${chance.string()}`,
        },
        pathParameters: {
          code,
        },
      }),
      null,
      null,
    )) as APIGatewayProxyResult;

    expect(res.statusCode).toStrictEqual(202);

    const user = await c.db().collection('users').findOne({
      connections: code,
    });

    expect(user).toBeDefined();
    expect(user.connections).toHaveLength(2);
    expect(user.connections[1]).toStrictEqual(response.sub);
  });
});
