import { APIGatewayProxyResult } from 'aws-lambda';
import Boom from '@hapi/boom';
import { auth0SharedSecret as secret } from '../../../src/config';
import { fetchUserByCodeHandlerFactory } from '../../../src/handlers/webhooks/fetch-by-code-handler';
import { userControllerMock } from '../../mocks/user-controller.mock';
import { getUserResponse } from '../../fixtures/user.fixtures';
import { getApiGatewayEvent } from '../../fixtures/lambda.fixtures';

const successfulApiGatewayEvent = getApiGatewayEvent({
  pathParameters: {
    code: 'welcomeCode',
  },
  headers: {
    Authorization: `Basic ${secret}`,
  },
});

describe('Fetch-user-by-code handler', () => {
  const handler = fetchUserByCodeHandlerFactory(userControllerMock);

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Validation', () => {
    test("return 400 when code isn't present", async () => {
      const result = (await handler(
        getApiGatewayEvent({
          headers: {
            Authorization: `Basic ${secret}`,
          },
        }),
      )) as APIGatewayProxyResult;

      expect(result.statusCode).toStrictEqual(400);
    });

    test('returns 401 when request is not authorized', async () => {
      const result = (await handler(
        getApiGatewayEvent({
          pathParameters: {
            code: 'welcomeCode',
          },
        }),
      )) as APIGatewayProxyResult;

      expect(result.statusCode).toStrictEqual(401);
    });

    test('returns 401 when request is not using Basic Auth', async () => {
      const result = (await handler(
        getApiGatewayEvent({
          pathParameters: {
            code: 'welcomeCode',
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
        getApiGatewayEvent({
          pathParameters: {
            code: 'welcomeCode',
          },
          headers: {
            Authorization: `Basic wrongSecret`,
          },
        }),
      )) as APIGatewayProxyResult;

      expect(result.statusCode).toStrictEqual(403);
    });
  });

  describe('GET /webhook/users/{code}', () => {
    test("returns 403 when code doesn't exist", async () => {
      userControllerMock.fetchByCode.mockRejectedValueOnce(Boom.forbidden());

      const result = (await handler(
        getApiGatewayEvent({
          pathParameters: {
            code: 'notFound',
          },
          headers: {
            Authorization: `Basic ${secret}`,
          },
        }),
      )) as APIGatewayProxyResult;

      expect(result.statusCode).toStrictEqual(403);
    });

    test('returns status 200 and user data when the user exists', async () => {
      userControllerMock.fetchByCode.mockResolvedValueOnce(getUserResponse());

      const result = (await handler(
        successfulApiGatewayEvent,
      )) as APIGatewayProxyResult;

      expect(result.statusCode).toStrictEqual(200);
      expect(JSON.parse(result.body)).toMatchObject(getUserResponse());
    });
  });
});
