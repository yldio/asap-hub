import { APIGatewayProxyResult } from 'aws-lambda';
import Boom from '@hapi/boom';
import { getApiGatewayEvent } from '../../../helpers/events';
import {
  algoliaSearchApiKey,
  auth0SharedSecret as secret,
} from '../../../../src/config';
import { identity } from '../../../helpers/squidex';
import { fetchUserByCodeHandlerFactory } from '../../../../src/handlers/webhooks/fetch-by-code/fetch-by-code';
import { SearchClient } from 'algoliasearch';
import { userControllerMock } from '../../../mocks/user-controller.mock';
import { getUserResponse } from '../../../fixtures/users.fixtures';

describe('Fetch-user-by-code handler', () => {
  const algoliaClientMock = {
    generateSecuredApiKey: jest.fn(),
  } as unknown as jest.Mocked<SearchClient>;
  const handler = fetchUserByCodeHandlerFactory(
    userControllerMock,
    algoliaClientMock,
  );

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
    beforeAll(() => {
      identity();
    });

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
        getApiGatewayEvent({
          pathParameters: {
            code: 'welcomeCode',
          },
          headers: {
            Authorization: `Basic ${secret}`,
          },
        }),
      )) as APIGatewayProxyResult;

      expect(result.statusCode).toStrictEqual(200);
      expect(JSON.parse(result.body)).toMatchObject(getUserResponse());
    });

    test('should return an algolia API key', async () => {
      const mockApiKey = 'test-api-key';
      algoliaClientMock.generateSecuredApiKey.mockReturnValueOnce(mockApiKey);
      userControllerMock.fetchByCode.mockResolvedValueOnce(getUserResponse());

      const result = (await handler(
        getApiGatewayEvent({
          pathParameters: {
            code: 'welcomeCode',
          },
          headers: {
            Authorization: `Basic ${secret}`,
          },
        }),
      )) as APIGatewayProxyResult;

      expect(result.statusCode).toStrictEqual(200);
      expect(JSON.parse(result.body)).toMatchObject({
        algoliaApiKey: mockApiKey,
      });
      expect(algoliaClientMock.generateSecuredApiKey).toBeCalledWith(
        algoliaSearchApiKey,
        {
          validUntil: expect.any(Number),
        },
      );
    });

    test('should return status 500 when algolia API key generation fails', async () => {
      algoliaClientMock.generateSecuredApiKey.mockImplementationOnce(() => {
        throw new Error('some error');
      });
      userControllerMock.fetchByCode.mockResolvedValueOnce(getUserResponse());

      const result = (await handler(
        getApiGatewayEvent({
          pathParameters: {
            code: 'welcomeCode',
          },
          headers: {
            Authorization: `Basic ${secret}`,
          },
        }),
      )) as APIGatewayProxyResult;

      expect(result.statusCode).toStrictEqual(500);
    });
  });
});
