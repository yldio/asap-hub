import Chance from 'chance';
import { handler } from '../../src/handlers/welcome';
import { apiGatewayEvent } from '../helpers/events';
import { APIGatewayProxyResult } from 'aws-lambda';
import { CMS } from '../../src/cms';

const chance = new Chance();
const cms = new CMS();

describe('GET /users/{code}', () => {
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
        queryStringParameters: {
          code: chance.string(),
        },
      }),
      null,
      null,
    )) as APIGatewayProxyResult;

    expect(result.statusCode).toStrictEqual(403);
  });

  test('returns 200 when code exists', async () => {
    const user = {
      displayName: `${chance.first()} ${chance.last()}`,
      email: chance.email(),
    };
    const createdUser = await cms.users.create(user);
    const [{ code }] = createdUser.data.connections.iv;

    const result = (await handler(
      apiGatewayEvent({
        httpMethod: 'get',
        queryStringParameters: {
          code,
        },
      }),
      null,
      null,
    )) as APIGatewayProxyResult;

    expect(result.statusCode).toStrictEqual(200);
  });
});
