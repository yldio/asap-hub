import { DynamoDBClient, GetItemCommand } from '@aws-sdk/client-dynamodb';

import { getCookiePreferencesHandlerFactory } from '../../../src/handlers/cookie-preferences/get-cookie-preferences-handler-factory';
import { Logger } from '../../../src/utils';
import { getLambdaGetRequest, getLambdaRequest } from '../../helpers/events';

jest.mock('@aws-sdk/client-dynamodb');

const logger = {
  info: jest.fn(),
  debug: jest.fn(),
} as unknown as jest.Mocked<Logger>;

describe('Get cookie preferences handler', () => {
  const tableName = 'cookie-preferences-table';
  const handler = getCookiePreferencesHandlerFactory(logger, tableName);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 400 if cookieId is not passed as param', async () => {
    const request = getLambdaGetRequest({});

    const response = await handler(request);

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual('cookieId is required');
  });

  it('should successfully get cookie', async () => {
    const mockDynamoClient = new DynamoDBClient(
      {},
    ) as jest.Mocked<DynamoDBClient>;

    const mockResponse = {
      $metadata: {
        httpStatusCode: 200,
        requestId: '12Q346P86IADEQDVG61R23T4R3VV4KQNSO5AEMVJF66Q9ASUAAJG',
        attempts: 1,
        totalRetryDelay: 0,
      },
      Item: {
        createdAt: {
          S: '2024-11-12T10:18:49.670Z',
        },
        cookieId: {
          S: '48d63907-9f58-4ebe-bbfd-0774d207a603',
        },
        preferences: {
          M: {
            analytics: {
              BOOL: false,
            },
            essential: {
              BOOL: true,
            },
          },
        },
      },
    };
    (mockDynamoClient.send as jest.Mock).mockResolvedValueOnce(mockResponse);

    const request = getLambdaGetRequest({
      cookieId: 'cookie-id',
    });

    const response = await handler(request);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(mockResponse.Item);

    expect(GetItemCommand).toHaveBeenCalledWith({
      TableName: tableName,
      Key: {
        cookieId: { S: 'cookie-id' },
      },
    });
  });

  it('should handle cookie not found error', async () => {
    const mockDynamoClient = new DynamoDBClient(
      {},
    ) as jest.Mocked<DynamoDBClient>;

    const mockResponse = {
      $metadata: {
        httpStatusCode: 200,
        requestId: '12Q346P86IADEQDVG61R23T4R3VV4KQNSO5AEMVJF66Q9ASUAAJG',
        attempts: 1,
        totalRetryDelay: 0,
      },
      Item: null,
    };
    (mockDynamoClient.send as jest.Mock).mockResolvedValueOnce(mockResponse);

    const request = getLambdaGetRequest({
      cookieId: 'cookie-id',
    });

    await expect(handler(request)).rejects.toThrow(
      'Cookie with id cookie-id not found',
    );
  });

  it('should handle DynamoDB errors', async () => {
    const mockDynamoClient = new DynamoDBClient(
      {},
    ) as jest.Mocked<DynamoDBClient>;

    (mockDynamoClient.send as jest.Mock).mockRejectedValueOnce(
      new Error('DynamoDB error'),
    );

    const request = getLambdaGetRequest({
      cookieId: 'cookie-id',
    });

    await expect(handler(request)).rejects.toThrow('DynamoDB error');
  });
});
