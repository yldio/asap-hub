import Chance from 'chance';
import nock from 'nock';
import { APIGatewayProxyResult } from 'aws-lambda';
import { config as authConfig } from '@asap-hub/auth';

import { handler } from '../../../src/handlers/research-outputs/fetch-by-id';
import { apiGatewayEvent } from '../../helpers/events';
import {
  createRandomUser,
  createRandomOutput,
} from '../../helpers/create-user';

const chance = new Chance();

describe('GET /users/{id}/research-outputs', () => {
  let id: string, code: string;

  beforeAll(async () => {
    const user = await createRandomUser();
    id = user.id;
    code = user.connections[0].code;
    await createRandomOutput(id);
  });

  test('return 401 when Authentication header is not set', async () => {
    const result = (await handler(
      apiGatewayEvent({
        httpMethod: 'get',
        pathParameters: {
          id,
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
          Authorization: `Basic ${chance.string()}`,
        },
        pathParameters: {
          id,
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
          Authorization: `Bearer ${chance.string()}`,
        },
        pathParameters: {
          id,
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
          Authorization: `Bearer ${chance.string()}`,
        },
        pathParameters: {
          id,
        },
      }),
    )) as APIGatewayProxyResult;

    expect(result.statusCode).toStrictEqual(403);
  });

  test("returns 200 when user doesn't exist", async () => {
    nock(`https://${authConfig.domain}`)
      .get('/userinfo')
      .reply(200, { sub: code });

    const result = (await handler(
      apiGatewayEvent({
        httpMethod: 'get',
        headers: {
          Authorization: `Bearer ${chance.string()}`,
        },
        pathParameters: {
          id: 'NotTheUser',
        },
      }),
    )) as APIGatewayProxyResult;

    const body = JSON.parse(result.body);

    expect(result.statusCode).toStrictEqual(200);
    expect(body.length).toStrictEqual(0);
  });

  test('returns 200 when user has no Outputs', async () => {
    const { id } = await createRandomUser();

    nock(`https://${authConfig.domain}`)
      .get('/userinfo')
      .reply(200, { sub: code });

    const result = (await handler(
      apiGatewayEvent({
        httpMethod: 'get',
        headers: {
          Authorization: `Bearer ${chance.string()}`,
        },
        pathParameters: {
          id,
        },
      }),
    )) as APIGatewayProxyResult;
    const body = JSON.parse(result.body);

    expect(result.statusCode).toStrictEqual(200);
    expect(body.length).toStrictEqual(0);
  });

  test('returns 200 when successfully fetches users Outputs', async () => {
    nock(`https://${authConfig.domain}`)
      .get('/userinfo')
      .reply(200, { sub: code });

    const result = (await handler(
      apiGatewayEvent({
        httpMethod: 'get',
        headers: {
          Authorization: `Bearer ${chance.string()}`,
        },
        pathParameters: {
          id,
        },
      }),
    )) as APIGatewayProxyResult;

    expect(result.statusCode).toStrictEqual(200);
  });
});
