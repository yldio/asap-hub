import Chance from 'chance';
import { APIGatewayProxyResult } from 'aws-lambda';
import { handler } from '../../src/handlers/welcome';
import { apiGatewayEvent } from '../utils/events';
import { Client } from '../utils/database';

jest.mock('../../src/handlers/mongodb');

const chance = new Chance();
describe('GET /api/profile/{code}', () => {
  let client: Client;

  beforeAll(async () => {
    client = new Client('mongodb://localhost/local');
  });

  afterAll(async () => {
    await Promise.all([
      client.clean('users'),
      client.clean('accounts'),
      client.close(),
    ]);
  });

  test("return 403 when the code doesn't exist", async () => {
    const result = (await handler(
      apiGatewayEvent({
        pathParameters: {
          code: chance.string(),
        },
      }),
      null,
      null,
    )) as APIGatewayProxyResult;

    expect(result.statusCode).toStrictEqual(403);
  });

  test('return 200 and the user profile', async () => {
    const code = chance.string();
    const user = {
      displayName: `${chance.first()} ${chance.last()}`,
      email: chance.email(),
      invite: {
        code,
      },
    };

    client.insert('users', [user]);
    const result = (await handler(
      apiGatewayEvent({
        pathParameters: {
          code,
        },
      }),
      null,
      null,
    )) as APIGatewayProxyResult;

    expect(result.statusCode).toEqual(200);
    const { id, ...body } = JSON.parse(result.body);
    expect(id).toBeDefined();
    expect(body).toStrictEqual({
      displayName: user.displayName,
      email: user.email,
    });
  });
});

describe('POST /api/profile/{code}', () => {
  let client: Client;
  beforeAll(async () => {
    client = new Client('mongodb://localhost/local');
  });

  afterAll(async () => {
    await Promise.all([
      client.clean('users'),
      client.clean('accounts'),
      client.close(),
    ]);
  });

  test("returns 403 when the bearer token is't present", async () => {
    const code = chance.string();
    const result = (await handler(
      apiGatewayEvent({
        httpMethod: 'POST',
        pathParameters: {
          code,
        },
      }),
      null,
      null,
    )) as APIGatewayProxyResult;

    expect(result.statusCode).toStrictEqual(403);
  });

  test("return 403 when the code doesn't exist", async () => {
    const code = chance.string();
    const user = {
      displayName: `${chance.first()} ${chance.last()}`,
      email: chance.email(),
      invite: {
        code,
      },
    };

    client.insert('users', [user]);
    const result = (await handler(
      apiGatewayEvent({
        httpMethod: 'POST',
        pathParameters: {
          code: 'non-existent-code',
        },
        headers: {
          Authorization: 'Bearer valid-identity-token',
        },
      }),
      null,
      null,
    )) as APIGatewayProxyResult;

    expect(result.statusCode).toStrictEqual(403);
  });

  test('return 204 and create a new identity relation', async () => {
    const code = chance.string();
    const user = {
      displayName: `${chance.first()} ${chance.last()}`,
      email: chance.email(),
      invite: {
        code,
      },
    };

    client.insert('users', [user]);
    const result = (await handler(
      apiGatewayEvent({
        httpMethod: 'POST',
        pathParameters: {
          code: 'code',
        },
        headers: {
          Authorization: 'Bearer valid-identity-token',
        },
      }),
      null,
      null,
    )) as APIGatewayProxyResult;

    console.log(result);
    expect(result.statusCode).toStrictEqual(204);
  });
});
