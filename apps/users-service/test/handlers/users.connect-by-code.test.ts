import Chance from 'chance';
import { APIGatewayProxyResult } from 'aws-lambda';
import { handler } from '../../src/handlers/welcome';
import { apiGatewayEvent } from '../helpers/events';
import connection from '../../src/utils/connection';

const chance = new Chance();
describe('POST /users/{code}', () => {
  afterAll(async () => {
    // close the singleton conneciton to local database
    const c = await connection();
    c.close();
  });

  test("returns 403 when code doesn't exist", async () => {
    const result = (await handler(
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

    expect(result.statusCode).toStrictEqual(403);
  });

  test('returns 200 for valid code', async () => {
    const code = chance.string();
    const c = await connection();
    await c
      .db()
      .collection('users')
      .insertMany([
        {
          displayName: `${chance.first()} ${chance.last()}`,
          email: chance.email(),
          invite: {
            code,
          },
        },
      ]);

    const result = (await handler(
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

    expect(result.statusCode).toStrictEqual(201);
  });
});
