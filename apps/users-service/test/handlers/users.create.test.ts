import Chance from 'chance';
import { APIGatewayProxyResult } from 'aws-lambda';
import { handler } from '../../src/handlers/create';
import { apiGatewayEvent } from '../helpers/events';
import connection from '../../src/utils/connection';

const chance = new Chance();
describe('POST /api/users', () => {
  afterAll(async () => {
    const c = await connection();
    c.close();
  });

  test("returns 400 when body isn't parsable as JSON", async () => {
    const result = (await handler(
      apiGatewayEvent({
        body: 'invalid json',
      }),
      null,
      null,
    )) as APIGatewayProxyResult;

    expect(result.statusCode).toStrictEqual(400);
  });

  test('return 400 when body is empty', async () => {
    const result = (await handler(
      apiGatewayEvent({}),
      null,
      null,
    )) as APIGatewayProxyResult;

    expect(result.statusCode).toStrictEqual(400);
  });

  test('returns 403 when email is a duplicate', async () => {
    const payload = {
      displayName: `${chance.first()} ${chance.last()}`,
      email: chance.email(),
    };

    const result1 = (await handler(
      apiGatewayEvent({
        httpMethod: 'post',
        body: payload,
      }),
      null,
      null,
    )) as APIGatewayProxyResult;

    expect(result1.statusCode).toStrictEqual(201);

    const result2 = (await handler(
      apiGatewayEvent({
        httpMethod: 'post',
        body: payload,
      }),
      null,
      null,
    )) as APIGatewayProxyResult;

    expect(result2.statusCode).toStrictEqual(403);
  });
});
