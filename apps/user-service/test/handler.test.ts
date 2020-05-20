import { createUser, welcome } from '../src/handler';
import { apiGatewayEvent } from './events';
import { APIGatewayProxyResult } from 'aws-lambda';
import { Client } from './helpers/database';

describe('/api/profile/{code}', () => {
  let client: Client;

  beforeAll(async () => {
    client = new Client('mongodb://localhost/local');
  });

  afterEach(async () => {
    await client.dropCollection('users');
  });

  describe('get', () => {
    test("return 403 when the code doesn't exist", async () => {
      client.insert('users', [
        {
          displayName: 'Filipe Pinheiro',
          email: 'filipe@yld.io',
          invite: {
            code: 'code',
          },
        },
      ]);

      const result = (await welcome(
        apiGatewayEvent({
          pathParameters: {
            code: 'non-existent-code',
          },
        }),
        null,
        null,
      )) as APIGatewayProxyResult;

      expect(result.statusCode).toStrictEqual(403);
    });

    test('return 200 and the user profile', async () => {
      client.insert('users', [
        {
          displayName: 'Filipe Pinheiro',
          email: 'filipe@yld.io',
          invite: {
            code: 'code',
          },
        },
      ]);

      const result = (await welcome(
        apiGatewayEvent({
          pathParameters: {
            code: 'code',
          },
        }),
        null,
        null,
      )) as APIGatewayProxyResult;

      expect(result.statusCode).toEqual(200);
      const { id, ...body } = JSON.parse(result.body);
      expect(id).toBeDefined();
      expect(body).toStrictEqual({
        displayName: 'Filipe Pinheiro',
        email: 'filipe@yld.io',
      });
    });
  });

  describe('post', () => {
    test("returns 403 when the bearer token is't present", async () => {
      const result = (await welcome(
        apiGatewayEvent({
          httpMethod: 'POST',
          pathParameters: {
            code: 'code',
          },
        }),
        null,
        null,
      )) as APIGatewayProxyResult;

      expect(result.statusCode).toStrictEqual(403);
    });

    test("return 403 when the code doesn't exist", async () => {
      client.insert('users', [
        {
          displayName: 'Filipe Pinheiro',
          email: 'filipe@yld.io',
          invite: {
            code: 'code',
          },
        },
      ]);

      const result = (await welcome(
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
      client.insert('users', [
        {
          displayName: 'Filipe Pinheiro',
          email: 'filipe@yld.io',
          invite: {
            code: 'code',
          },
        },
      ]);

      const result = (await welcome(
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

      expect(result.statusCode).toStrictEqual(204);
    });
  });
});

describe('/api/users', () => {
  test('reject invalid payload', async () => {
    const result = (await createUser(
      apiGatewayEvent({
        body: {
          property: 'other',
          displayName: 'Filipe Pinheiro',
          email: 'filipe@yld.io',
        },
        httpMethod: 'POST',
      }),
      null,
      null,
    )) as APIGatewayProxyResult;

    expect(result.statusCode).toStrictEqual(400);
  });

  test('return 201', async () => {
    const result = (await createUser(
      apiGatewayEvent({
        body: {
          displayName: 'Filipe Pinheiro',
          email: 'filipe@yld.io',
        },
        httpMethod: 'POST',
      }),
      null,
      null,
    )) as APIGatewayProxyResult;

    expect(result.statusCode).toStrictEqual(201);
  });
});
