import nock from 'nock';
import Chance from 'chance';

import { APIGatewayProxyResult } from 'aws-lambda';
import { config as authConfig } from '@asap-hub/auth';

import { handler } from '../../../src/handlers/users/fetch-by-id';
import { apiGatewayEvent } from '../../helpers/events';
import { createRandomUser } from '../../helpers/create-user';

const chance = new Chance();

describe('GET /users/{id}', () => {
  test("return 400 when id isn't present", async () => {
    const result = (await handler(
      apiGatewayEvent({
        httpMethod: 'get',
      }),
      null,
      null,
    )) as APIGatewayProxyResult;

    expect(result.statusCode).toStrictEqual(400);
  });

  test("returns 404 when id doesn't exist", async () => {
    nock(`https://${authConfig.domain}`).get('/userinfo').reply(200);

    const result = (await handler(
      apiGatewayEvent({
        httpMethod: 'get',
        pathParameters: {
          id: chance.string(),
        },
        headers: {
          Authorization: `Bearer ${chance.string()}`,
        },
      }),
      null,
      null,
    )) as APIGatewayProxyResult;

    expect(result.statusCode).toStrictEqual(404);
  });

  test('returns 200 when id exists', async () => {
    nock(`https://${authConfig.domain}`).get('/userinfo').reply(200);

    const { id, displayName } = await createRandomUser();

    const result = (await handler(
      apiGatewayEvent({
        httpMethod: 'get',
        pathParameters: {
          id,
        },
        headers: {
          Authorization: `Bearer ${chance.string()}`,
        },
      }),
      null,
      null,
    )) as APIGatewayProxyResult;

    const body = JSON.parse(result.body);
    expect(result.statusCode).toStrictEqual(200);
    expect(body.id).toStrictEqual(id);
    expect(body.displayName).toStrictEqual(displayName);
  });
});
