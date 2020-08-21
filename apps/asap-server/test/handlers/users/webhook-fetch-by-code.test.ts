import Chance from 'chance';
import { APIGatewayProxyResult } from 'aws-lambda';

import { handler } from '../../../src/handlers/users/webhook-fetch-by-code';
import { apiGatewayEvent } from '../../helpers/events';
import { createRandomUser } from '../../helpers/create-user';
import { auth0SharedSecret as secret } from '../../../src/config';

const chance = new Chance();

describe('POST /webhook/users/{code}', () => {
  test("return 400 when code isn't present", async () => {
    const result = (await handler(
      apiGatewayEvent({
        httpMethod: 'get',
        headers: {
          Authorization: `Basic ${secret}`,
        },
      }),
    )) as APIGatewayProxyResult;

    expect(result.statusCode).toStrictEqual(400);
  });

  test('returns 401 when request is not authorized', async () => {
    const result = (await handler(
      apiGatewayEvent({
        httpMethod: 'get',
        pathParameters: {
          code: chance.string(),
        },
      }),
    )) as APIGatewayProxyResult;

    expect(result.statusCode).toStrictEqual(401);
  });

  test('returns 401 when request is not using Basic Auth', async () => {
    const result = (await handler(
      apiGatewayEvent({
        httpMethod: 'get',
        pathParameters: {
          code: chance.string(),
        },
        headers: {
          Authorization: `Bearer ${secret}`,
        },
      }),
    )) as APIGatewayProxyResult;

    expect(result.statusCode).toStrictEqual(401);
  });

  test('returns 403 when secret doesnt match', async () => {
    const result = (await handler(
      apiGatewayEvent({
        httpMethod: 'get',
        pathParameters: {
          code: chance.string(),
        },
        headers: {
          Authorization: `Basic ${chance.string()}`,
        },
      }),
    )) as APIGatewayProxyResult;

    expect(result.statusCode).toStrictEqual(403);
  });

  test("returns 404 when code doesn't exist", async () => {
    const result = (await handler(
      apiGatewayEvent({
        httpMethod: 'get',
        pathParameters: {
          code: chance.string(),
        },
        headers: {
          Authorization: `Basic ${secret}`,
        },
      }),
    )) as APIGatewayProxyResult;

    expect(result.statusCode).toStrictEqual(404);
  });

  test('returns 200 when user exists', async () => {
    const { connections, ...newUser } = await createRandomUser();

    const result = (await handler(
      apiGatewayEvent({
        httpMethod: 'get',
        pathParameters: {
          code: newUser.id,
        },
        headers: {
          Authorization: `Basic ${secret}`,
        },
      }),
    )) as APIGatewayProxyResult;

    const user = JSON.parse(result.body);
    expect(result.statusCode).toStrictEqual(200);
    expect(user).toStrictEqual(newUser);
  });
});
