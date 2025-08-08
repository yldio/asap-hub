import { UserResponse } from '@asap-hub/model';
import { OpenSearchRequest, OpenSearchResponse } from '@asap-hub/server-common';
import { LambdaClient, InvokeCommand } from '@aws-sdk/client-lambda';
import OpenSearchProvider from '../../src/data-providers/opensearch.data-provider';

jest.mock('@aws-sdk/client-lambda');

const mockConfig = {
  region: 'us-east-1',
  environment: 'test',
};

const mockLogger = {
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
};

describe('OpenSearchProvider', () => {
  let openSearchProvider: OpenSearchProvider;
  let mockLambdaClient: jest.Mocked<LambdaClient>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockSend: jest.MockedFunction<any>;

  const mockUser: UserResponse = {
    id: 'user-123',
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
  } as UserResponse;

  const mockSearchRequest: OpenSearchRequest = {
    query: {
      match: {
        teamName: 'alpha',
      },
    },
    size: 10,
    from: 0,
  };

  const mockSearchResponse: OpenSearchResponse = {
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

    // Mock LambdaClient constructor and methods
    mockSend = jest.fn() as jest.MockedFunction<LambdaClient['send']>;
    mockLambdaClient = {
      send: mockSend,
    } as unknown as jest.Mocked<LambdaClient>;

    (LambdaClient as jest.MockedClass<typeof LambdaClient>).mockImplementation(
      () => mockLambdaClient,
    );

    jest.doMock('../../src/config', () => mockConfig);
    jest.doMock('../../src/utils/logger', () => ({ default: mockLogger }));

    openSearchProvider = new OpenSearchProvider();
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

      const result = await openSearchProvider.search({
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
        openSearchProvider.search({
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

      const result = await openSearchProvider.search({
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
            body: JSON.stringify({
              data: mockSearchResponse,
            }),
          }),
        ),
      };

      mockSend.mockResolvedValueOnce(successfulLambdaResponse);

      const result = await openSearchProvider.search({
        index: 'os-champion',
        body: requestWithoutPagination,
        loggedInUser: mockUser,
      });

      expect(result).toEqual(mockSearchResponse);
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

      const result = await openSearchProvider.search({
        index: 'os-champion',
        body: mockSearchRequest,
        loggedInUser: mockUser,
        size: 20,
        from: 10,
      });

      expect(result).toEqual(mockSearchResponse);
    });

    test('Should throw error when Lambda returns empty response', async () => {
      mockSend.mockResolvedValueOnce({ Payload: undefined });

      await expect(
        openSearchProvider.search({
          index: 'os-champion',
          body: mockSearchRequest,
          loggedInUser: mockUser,
        }),
      ).rejects.toThrow('Lambda returned an empty response');
    });

    test('Should throw error when Lambda execution fails', async () => {
      const errorResponse = {
        Payload: new TextEncoder().encode(
          JSON.stringify({
            errorType: 'LambdaError',
            errorMessage: 'Function execution failed',
          }),
        ),
      };

      mockSend.mockResolvedValueOnce(errorResponse);

      await expect(
        openSearchProvider.search({
          index: 'os-champion',
          body: mockSearchRequest,
          loggedInUser: mockUser,
        }),
      ).rejects.toThrow('Invalid JSON response from Lambda');
    });

    test('Should throw error when OpenSearch returns 4xx status', async () => {
      const errorResponse = {
        Payload: new TextEncoder().encode(
          JSON.stringify({
            statusCode: 400,
            body: JSON.stringify({
              error: 'Bad Request',
              message: 'Invalid query syntax',
            }),
          }),
        ),
      };

      mockSend.mockResolvedValueOnce(errorResponse);

      await expect(
        openSearchProvider.search({
          index: 'os-champion',
          body: mockSearchRequest,
          loggedInUser: mockUser,
        }),
      ).rejects.toThrow('Invalid JSON response from Lambda');
    });

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
        openSearchProvider.search({
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
        openSearchProvider.search({
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

      const result = await openSearchProvider.search({
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

      const result = await openSearchProvider.search({
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
        openSearchProvider.search({
          index: 'os-champion',
          body: mockSearchRequest,
          loggedInUser: mockUser,
        }),
      ).rejects.toThrow('Lambda service unavailable');
    });
  });
});
