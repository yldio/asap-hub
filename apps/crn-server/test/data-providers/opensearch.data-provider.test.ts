import { UserResponse } from '@asap-hub/model';
import { OpensearchRequest, OpensearchResponse } from '@asap-hub/server-common';
import { LambdaClient, InvokeCommand } from '@aws-sdk/client-lambda';
import OpensearchProvider from '../../src/data-providers/opensearch.data-provider';
import logger from '../../src/utils/logger';

jest.mock('@aws-sdk/client-lambda', () => {
  const actual = jest.requireActual('@aws-sdk/client-lambda');
  return {
    ...actual,
    LambdaClient: jest.fn(),
  };
});

const mockConfig = {
  region: 'us-east-1',
  environment: 'test',
};

jest.doMock('../../src/config', () => mockConfig);

describe('OpensearchProvider', () => {
  let opensearchProvider: OpensearchProvider;
  let mockSend: jest.Mock;

  const mockUser: UserResponse = {
    id: 'user-123',
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
  } as UserResponse;

  const mockSearchRequest: OpensearchRequest = {
    query: {
      match: {
        teamName: 'alpha',
      },
    },
    size: 10,
    from: 0,
  };

  const mockSearchResponse: OpensearchResponse = {
    took: 2,
    timed_out: false,
    _shards: {
      total: 1,
      successful: 1,
      skipped: 0,
      failed: 0,
    },
    hits: {
      total: {
        value: 3,
        relation: 'eq',
      },
      max_score: 1.2,
      hits: [
        {
          _index: 'os-champion-test',
          _id: 'team-1',
          _score: 1.2,
          _source: {
            teamId: 'team-123',
            teamName: 'Alpha Team',
            isTeamInactive: false,
            teamAwardsCount: 2,
            users: [
              {
                id: 'user-1',
                name: 'John Doe',
                awardsCount: 1,
              },
            ],
          },
        },
        {
          _index: 'os-champion-test',
          _id: 'team-2',
          _score: 1.0,
          _source: {
            teamId: 'team-456',
            teamName: 'Beta Team',
            isTeamInactive: true,
            teamAwardsCount: 0,
            users: [],
          },
        },
      ],
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockSend = jest.fn();

    (LambdaClient as unknown as jest.Mock).mockImplementation(() => ({
      send: mockSend,
    }));

    opensearchProvider = new OpensearchProvider();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('search method', () => {
    test('Should successfully search and return results', async () => {
      const successfulLambdaResponse = {
        Payload: new TextEncoder().encode(
          JSON.stringify({
            statusCode: 200,
            body: JSON.stringify({
              data: mockSearchResponse,
            }),
          }),
        ),
      };

      mockSend.mockResolvedValueOnce(successfulLambdaResponse);

      const result = await opensearchProvider.search({
        index: 'os-champion',
        body: mockSearchRequest,
        loggedInUser: mockUser,
      });

      expect(result).toEqual(mockSearchResponse);
      expect(mockSend).toHaveBeenCalledTimes(1);
      expect(mockSend).toHaveBeenCalledWith(expect.any(InvokeCommand));
    });

    test('Should throw Boom forbidden error when user is not logged in', async () => {
      await expect(
        opensearchProvider.search({
          index: 'os-champion',
          body: mockSearchRequest,
          loggedInUser: null as any,
        }),
      ).rejects.toThrow();
    });

    test('Should handle Uint8Array payload response', async () => {
      const uint8ArrayPayload = new TextEncoder().encode(
        JSON.stringify({
          statusCode: 200,
          body: JSON.stringify({
            data: mockSearchResponse,
          }),
        }),
      );

      const lambdaResponse = {
        Payload: uint8ArrayPayload,
      };

      mockSend.mockResolvedValueOnce(lambdaResponse);

      const result = await opensearchProvider.search({
        index: 'os-champion',
        body: mockSearchRequest,
        loggedInUser: mockUser,
      });

      expect(result).toEqual(mockSearchResponse);
    });

    test('Should use default size and from when not provided', async () => {
      const requestWithoutPagination = {
        query: {
          term: { isTeamInactive: false },
        },
      };

      const successfulLambdaResponse = {
        Payload: new TextEncoder().encode(
          JSON.stringify({
            statusCode: 200,
            body: {
              data: mockSearchResponse,
            },
          }),
        ),
      };

      mockSend.mockResolvedValueOnce(successfulLambdaResponse);

      await opensearchProvider.search({
        index: 'os-champion',
        body: requestWithoutPagination,
        loggedInUser: mockUser,
      });

      const requestSent = mockSend.mock.calls[0][0];
      const payloadString = requestSent.input.Payload;
      const eventPayload = JSON.parse(payloadString);
      const parsedBody = JSON.parse(eventPayload.body);

      expect(parsedBody).toEqual(
        expect.objectContaining({
          size: 10,
          from: 0,
        }),
      );
    });

    test('Should use provided size and from parameters', async () => {
      const successfulLambdaResponse = {
        Payload: new TextEncoder().encode(
          JSON.stringify({
            statusCode: 200,
            body: JSON.stringify({
              data: mockSearchResponse,
            }),
          }),
        ),
      };

      mockSend.mockResolvedValueOnce(successfulLambdaResponse);
      const size = 20;
      const from = 10;

      await opensearchProvider.search({
        index: 'os-champion',
        body: mockSearchRequest,
        loggedInUser: mockUser,
        size,
        from,
      });

      const requestSent = mockSend.mock.calls[0][0];
      const payloadString = requestSent.input.Payload;
      const eventPayload = JSON.parse(payloadString);
      const parsedBody = JSON.parse(eventPayload.body);

      expect(parsedBody).toEqual(
        expect.objectContaining({
          size,
          from,
        }),
      );
    });

    test('Should throw error when Lambda returns empty response', async () => {
      mockSend.mockResolvedValueOnce({ Payload: undefined });

      await expect(
        opensearchProvider.search({
          index: 'os-champion',
          body: mockSearchRequest,
          loggedInUser: mockUser,
        }),
      ).rejects.toThrow('Lambda returned an empty response');
    });

    test('Should throw error when Lambda execution fails', async () => {
      const loggerErrorSpy = jest.spyOn(logger, 'error');
      const errorMessage = 'Function execution failed';
      const errorResponse = {
        Payload: new TextEncoder().encode(
          JSON.stringify({
            errorType: 'LambdaError',
            errorMessage,
          }),
        ),
      };

      mockSend.mockResolvedValueOnce(errorResponse);

      await expect(
        opensearchProvider.search({
          index: 'os-champion',
          body: mockSearchRequest,
          loggedInUser: mockUser,
        }),
      ).rejects.toThrow('Invalid JSON response from Lambda');

      expect(loggerErrorSpy).toHaveBeenCalledWith(
        'Error parsing Lambda response',
        expect.objectContaining({
          errorMessage: 'Lambda execution error: Function execution failed',
        }),
      );
    });

    test.each([
      [
        'body as stringified JSON',
        JSON.stringify({
          error: 'Bad Request',
          message: 'Invalid query syntax',
        }),
      ],
      [
        'body as object',
        {
          error: 'Bad Request',
          message: 'Invalid query syntax',
        },
      ],
    ])(
      'Should throw error when Opensearch returns 4xx status with %s',
      async (_desc, body) => {
        const loggerErrorSpy = jest.spyOn(logger, 'error');

        const errorResponse = {
          Payload: new TextEncoder().encode(
            JSON.stringify({
              statusCode: 400,
              body,
            }),
          ),
        };

        mockSend.mockResolvedValueOnce(errorResponse);

        await expect(
          opensearchProvider.search({
            index: 'os-champion',
            body: mockSearchRequest,
            loggedInUser: mockUser,
          }),
        ).rejects.toThrow(/Invalid JSON response from Lambda/i);

        expect(loggerErrorSpy).toHaveBeenCalledWith(
          'Error parsing Lambda response',
          expect.objectContaining({
            errorMessage: expect.stringMatching(
              /Opensearch operation failed with status 400:/i,
            ),
          }),
        );
      },
    );

    test('Should throw error when Lambda response is missing body', async () => {
      const responseWithoutBody = {
        Payload: new TextEncoder().encode(
          JSON.stringify({
            statusCode: 200,
          }),
        ),
      };

      mockSend.mockResolvedValueOnce(responseWithoutBody);

      await expect(
        opensearchProvider.search({
          index: 'os-champion',
          body: mockSearchRequest,
          loggedInUser: mockUser,
        }),
      ).rejects.toThrow('Invalid JSON response from Lambda');
    });

    test('Should throw error when Lambda returns invalid JSON', async () => {
      const invalidJsonResponse = {
        Payload: new TextEncoder().encode('invalid json response'),
      };

      mockSend.mockResolvedValueOnce(invalidJsonResponse);

      await expect(
        opensearchProvider.search({
          index: 'os-champion',
          body: mockSearchRequest,
          loggedInUser: mockUser,
        }),
      ).rejects.toThrow('Invalid JSON response from Lambda');
    });

    test('Should handle response without data wrapper', async () => {
      const directResponse = {
        Payload: new TextEncoder().encode(
          JSON.stringify({
            statusCode: 200,
            body: JSON.stringify(mockSearchResponse),
          }),
        ),
      };

      mockSend.mockResolvedValueOnce(directResponse);

      const result = await opensearchProvider.search({
        index: 'os-champion',
        body: mockSearchRequest,
        loggedInUser: mockUser,
      });

      expect(result).toEqual(mockSearchResponse);
    });

    test('Should handle string payload response format', async () => {
      const stringPayloadResponse = {
        Payload: {
          toString: () =>
            JSON.stringify({
              statusCode: 200,
              body: JSON.stringify({
                data: mockSearchResponse,
              }),
            }),
        },
      };

      mockSend.mockResolvedValueOnce(stringPayloadResponse);

      const result = await opensearchProvider.search({
        index: 'os-champion',
        body: mockSearchRequest,
        loggedInUser: mockUser,
      });

      expect(result).toEqual(mockSearchResponse);
    });

    test('Should handle Lambda invocation errors', async () => {
      const invocationError = new Error('Lambda service unavailable');
      mockSend.mockRejectedValueOnce(invocationError);

      await expect(
        opensearchProvider.search({
          index: 'os-champion',
          body: mockSearchRequest,
          loggedInUser: mockUser,
        }),
      ).rejects.toThrow('Lambda service unavailable');
    });
  });
});
