import { APIGatewayProxyResult } from 'aws-lambda';
import Boom from '@hapi/boom';
import { SearchClient } from 'algoliasearch';
import { getApiGatewayEvent } from '../../../helpers/events';
import {
  algoliaApiKey,
  auth0SharedSecret as secret,
} from '../../../../src/config';
import { identity } from '../../../helpers/squidex';
import { fetchUserByCodeHandlerFactory } from '../../../../src/handlers/webhooks/fetch-by-code/fetch-by-code';
import { userControllerMock } from '../../../mocks/user-controller.mock';
import { getUserResponse } from '../../../fixtures/users.fixtures';

const successfulApiGatewayEvent = getApiGatewayEvent({
  pathParameters: {
    code: 'welcomeCode',
  },
  headers: {
    Authorization: `Basic ${secret}`,
  },
});

describe('Fetch-user-by-code handler', () => {
  const algoliaClientMock = {
    generateSecuredApiKey: jest.fn(),
  } as unknown as jest.Mocked<SearchClient>;
  const handler = fetchUserByCodeHandlerFactory(
    userControllerMock,
    algoliaClientMock,
  );

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('checks if algolia validUntil is in correct format(seconds)', async () => {
    const customHandler = fetchUserByCodeHandlerFactory(
      userControllerMock,
      algoliaClientMock,
      new Date(1000),
      1,
    );

    algoliaClientMock.generateSecuredApiKey.mockReturnValueOnce('test-api-key');
    userControllerMock.fetchByCode.mockResolvedValueOnce(getUserResponse());

    await customHandler(successfulApiGatewayEvent);

    expect(algoliaClientMock.generateSecuredApiKey).toBeCalledWith(
      algoliaApiKey,
      {
        validUntil: expect.any(Number),
      },
    );
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

    test('returns 401 when additional fields exist', async () => {
      const result = (await handler(
        getApiGatewayEvent({
          pathParameters: {
            code: 'welcomeCode',
            additionalField: 'some-value',
          },
          headers: {
            Authorization: `Basic ${secret}`,
          },
        }),
      )) as APIGatewayProxyResult;

      expect(result.statusCode).toStrictEqual(400);
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
        successfulApiGatewayEvent,
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
        algoliaApiKey,
        {
          validUntil: expect.any(Number),
        },
      );
    });

    describe('Algolia token expiration', () => {
      beforeAll(() => {
        // this is to prevent from real time elapse
        jest.useFakeTimers();
      });
      afterAll(() => {
        jest.useRealTimers();
      });

      test('should ask for a key with expiration which is 601 minutes (10 hours 1 minute) ahead of now', async () => {
        const dateReference = '2021-07-06T09:21:23.000Z';
        jest
          .useFakeTimers('modern')
          .setSystemTime(new Date(dateReference).getTime());
        const handler = fetchUserByCodeHandlerFactory(
          userControllerMock,
          algoliaClientMock,
        );
        const now = new Date();
        const tenHoursOneMinuteLater = new Date(now.getTime() + 601 * 60000);

        await handler(
          getApiGatewayEvent({
            pathParameters: {
              code: 'welcomeCode',
            },
            headers: {
              Authorization: `Basic ${secret}`,
            },
          }),
        );

        // get the unix timestamp in seconds and round it
        const expectedValidUntil = Math.floor(
          tenHoursOneMinuteLater.getTime() / 1000,
        );

        expect(algoliaClientMock.generateSecuredApiKey).toBeCalledWith(
          algoliaApiKey,
          {
            validUntil: expectedValidUntil,
          },
        );
      });
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
