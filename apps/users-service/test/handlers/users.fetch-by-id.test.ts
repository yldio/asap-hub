import Chance from 'chance';
import { handler } from '../../src/handlers/fetch-by-id';
import { apiGatewayEvent } from '../helpers/events';
import { APIGatewayProxyResult } from 'aws-lambda';
import { createRandomUser } from '../helpers/create-user';

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
    const result = (await handler(
      apiGatewayEvent({
        httpMethod: 'get',
        pathParameters: {
          id: chance.string(),
        },
      }),
      null,
      null,
    )) as APIGatewayProxyResult;

    expect(result.statusCode).toStrictEqual(404);
  });

  test('returns 200 when id exists', async () => {
    const { id, displayName } = await createRandomUser();

    const result = (await handler(
      apiGatewayEvent({
        httpMethod: 'get',
        pathParameters: {
          id,
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
