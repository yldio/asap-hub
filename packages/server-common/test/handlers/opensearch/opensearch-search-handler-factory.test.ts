import { framework as lambda } from '@asap-hub/services-common';
import {
  opensearchSearchHandlerFactory,
  SearchInput,
} from '../../../src/handlers/opensearch';
import { getClient, Logger } from '../../../src/utils';

jest.mock('../../../src/utils');
const logger = {
  info: jest.fn(),
  error: jest.fn(),
} as unknown as jest.Mocked<Logger>;

const mockSearch = jest.fn();
const mockClient = {
  search: mockSearch,
};

const getClientMock = getClient as jest.Mock;

const openSearchUsername = 'test-username';
const openSearchPassword = 'test-password';
const awsRegion = 'us-east-1';
const stage = 'dev';

const handler = opensearchSearchHandlerFactory(
  logger,
  awsRegion,
  stage,
  openSearchUsername,
  openSearchPassword,
);

describe('opensearchSearchHandlerFactory', () => {
  const defaultPayload = { query: { match: { title: 'Test' } } };

  const defaultRequest: lambda.Request<SearchInput> = {
    method: 'post',
    rawPayload: JSON.stringify(defaultPayload),
    headers: {},
    payload: defaultPayload,
    params: { index: 'test-index' },
  };
  beforeEach(() => {
    jest.clearAllMocks();
    getClientMock.mockResolvedValue(mockClient);
  });

  test('returns 400 if index is missing', async () => {
    const request = { params: {}, payload: {} } as lambda.Request<SearchInput>;

    const response = await handler(request);

    expect(response.statusCode).toBe(400);
    expect(response.payload).toEqual({
      error: 'Missing index path parameter',
    });
  });

  test('returns 200 and search results on success', async () => {
    const mockResponse = {
      statusCode: 200,
      body: {
        hits: {
          total: { value: 10 },
          max_score: 1.5,
          hits: [{ _id: '1' }, { _id: '2' }],
        },
      },
    };

    mockSearch.mockResolvedValue(mockResponse);
    const res = await handler(defaultRequest);

    expect(res.statusCode).toBe(200);
    expect(res.payload).toEqual({
      data: mockResponse.body,
      totalHits: 10,
      maxScore: 1.5,
    });

    expect(mockSearch).toHaveBeenCalledWith({
      index: 'test-index',
      body: {
        query: { match: { title: 'Test' } },
      },
    });
  });

  test('handles case when total is not an object', async () => {
    const mockResponse = {
      statusCode: 200,
      body: {
        hits: {
          total: 10,
          max_score: 1.5,
          hits: [{ _id: '1' }, { _id: '2' }],
        },
      },
    };

    mockSearch.mockResolvedValue(mockResponse);
    const res = await handler(defaultRequest);

    expect(res.statusCode).toBe(200);
    expect(res.payload).toEqual(
      expect.objectContaining({
        totalHits: 10,
      }),
    );
  });

  test('returns error when OpenSearch responds with non-2xx status code', async () => {
    const mockResponse: { statusCode: number; body: unknown } = {
      statusCode: 500,
      body: { error: 'Something went wrong' },
    };

    mockSearch.mockResolvedValue(mockResponse);
    const response = await handler(defaultRequest);

    expect(response.statusCode).toBe(500);
    expect(response.payload).toEqual({
      error: 'OpenSearch search error',
      details: JSON.stringify(mockResponse.body),
    });
  });

  test('returns 500 if OpenSearch client throws error', async () => {
    mockSearch.mockRejectedValue(new Error('OpenSearch failure'));

    const response = await handler(defaultRequest);

    expect(response.statusCode).toBe(500);
    expect(response.payload).toEqual({
      error: 'Error executing OpenSearch search operation',
      details: 'OpenSearch failure',
    });

    expect(logger.error).toHaveBeenCalledWith(
      'Error executing OpenSearch search operation',
      expect.objectContaining({
        error: expect.objectContaining({
          message: 'OpenSearch failure',
        }),
      }),
    );
  });

  test('handles case when error thrown is not an instance of Error type', async () => {
    mockSearch.mockRejectedValue('OpenSearch failure');

    const response = await handler(defaultRequest);

    expect(response.statusCode).toBe(500);
    expect(logger.error).toHaveBeenCalledWith(
      'Error executing OpenSearch search operation',
      expect.objectContaining({
        error: 'OpenSearch failure',
      }),
    );
  });
});
