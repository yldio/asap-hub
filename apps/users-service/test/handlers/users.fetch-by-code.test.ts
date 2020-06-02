import Chance from 'chance';
import { handler } from '../../src/handlers/welcome';
import { apiGatewayEvent } from '../helpers/events';
import connection from '../../src/utils/connection';
import { APIGatewayProxyResult } from 'aws-lambda';

const chance = new Chance();
describe('GET /users/{code}', () => {
  afterAll(async () => {
    const c = await connection();
    await c.close(true);
  });

  test("return 400 when code isn't present", async () => {
    const result = (await handler(
      apiGatewayEvent({
        httpMethod: 'get',
      }),
      null,
      null,
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
      null,
      null,
    )) as APIGatewayProxyResult;

    expect(result.statusCode).toStrictEqual(403);
  });

  test('returns 200 when code exists', async () => {
    const c = await connection();
    const code = chance.string();
    const user = {
      displayName: `${chance.first()} ${chance.last()}`,
      email: chance.email(),
      connections: [code],
    };

    await c.db().collection('users').insertMany([user]);
    const result = (await handler(
      apiGatewayEvent({
        httpMethod: 'get',
        pathParameters: {
          code,
        },
      }),
      null,
      null,
    )) as APIGatewayProxyResult;

    expect(result.statusCode).toStrictEqual(200);
  });
});
