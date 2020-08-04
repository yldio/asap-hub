import Chance from 'chance';
import { APIGatewayProxyResult } from 'aws-lambda';

import { handler } from '../../../src/handlers/users/fetch-by-code';
import { createRandomUser } from '../../helpers/create-user';
import { apiGatewayEvent } from '../../helpers/events';

const chance = new Chance();

describe('GET /users/invites/{code}', () => {
  test("return 400 when code isn't present", async () => {
    const result = (await handler(
      apiGatewayEvent({
        httpMethod: 'get',
      }),
    )) as APIGatewayProxyResult;

    expect(result.statusCode).toStrictEqual(400);
  });

  test("returns 403 code doesn't exist", async () => {
    const result = (await handler(
      apiGatewayEvent({
        httpMethod: 'get',
        pathParameters: {
          code: chance.string(),
        },
      }),
    )) as APIGatewayProxyResult;

    expect(result.statusCode).toStrictEqual(403);
  });

  test('returns 200 when code exists', async () => {
    const {
      id,
      displayName,
      connections: [{ code }],
    } = await createRandomUser({});

    const result = (await handler(
      apiGatewayEvent({
        httpMethod: 'get',
        pathParameters: {
          code,
        },
      }),
    )) as APIGatewayProxyResult;
    const body = JSON.parse(result.body);

    expect(result.statusCode).toStrictEqual(200);
    expect(body.id).toStrictEqual(id);
    expect(body.displayName).toStrictEqual(displayName);
  });
});
