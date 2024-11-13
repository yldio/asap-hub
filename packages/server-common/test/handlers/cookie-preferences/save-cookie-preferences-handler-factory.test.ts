import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';

import { saveCookiePreferencesHandlerFactory } from '../../../src/handlers/cookie-preferences/save-cookie-preferences-handler-factory';
import { Logger } from '../../../src/utils';
import { getLambdaRequest } from '../../helpers/events';

jest.mock('@aws-sdk/client-dynamodb');

const logger = {
  info: jest.fn(),
  debug: jest.fn(),
} as unknown as jest.Mocked<Logger>;

describe('Save cookie preferences handler', () => {
  const tableName = 'cookie-preferences-table';
  const handler = saveCookiePreferencesHandlerFactory(logger, tableName);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Validations', () => {
    test('returns 400 when cookieId is not defined', async () => {
      const request = getLambdaRequest({ preferences: {} }, {});
      expect(handler(request)).rejects.toThrow('Validation error');
    });

    test('returns 400 when preferences is not defined', async () => {
      const request = getLambdaRequest({ cookieId: 'cookieId' }, {});
      expect(handler(request)).rejects.toThrow('Validation error');
    });

    test.each(['essential', 'analytics'])(
      'returns 400 when %s inside preferences is not a boolean',
      async (key) => {
        const request = getLambdaRequest(
          { cookieId: 'cookieId', preferences: { [key]: 'true' } },
          {},
        );
        expect(handler(request)).rejects.toThrow('Validation error');
      },
    );

    test.each(['essential', 'analytics'])(
      'returns 400 when one of the fields inside preferences is missing',
      async (key) => {
        const request = getLambdaRequest(
          { cookieId: 'cookieId', preferences: { [key]: true } },
          {},
        );
        expect(handler(request)).rejects.toThrow('Validation error');
      },
    );

    test('returns 400 when additional fields are present', async () => {
      const request = getLambdaRequest(
        {
          cookieId: 'cookieId',
          preferences: { essential: true, analytics: false },
          additionalField: 'some-field',
        },
        {},
      );
      expect(handler(request)).rejects.toThrow('Validation error');
    });
  });

  it('should successfully save cookie preferences', async () => {
    const mockDynamoClient = new DynamoDBClient(
      {},
    ) as jest.Mocked<DynamoDBClient>;

    const mockResponse = { metadata: { httpStatusCode: 200 } };
    (mockDynamoClient.send as jest.Mock).mockResolvedValueOnce(mockResponse);

    const request = getLambdaRequest(
      {
        cookieId: 'cookie-id',
        preferences: {
          essential: true,
          analytics: false,
        },
      },
      {},
    );

    const response = await handler(request);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(JSON.stringify(mockResponse));

    expect(PutItemCommand).toHaveBeenCalledWith({
      TableName: tableName,
      Item: {
        cookieId: { S: 'cookie-id' },
        preferences: {
          M: {
            essential: { BOOL: true },
            analytics: { BOOL: false },
          },
        },
        createdAt: { S: expect.any(String) },
      },
    });
  });

  it('should handle DynamoDB errors', async () => {
    const mockDynamoClient = new DynamoDBClient(
      {},
    ) as jest.Mocked<DynamoDBClient>;

    (mockDynamoClient.send as jest.Mock).mockRejectedValueOnce(
      new Error('DynamoDB error'),
    );

    const request = getLambdaRequest(
      {
        cookieId: 'cookie-id',
        preferences: {
          essential: true,
          analytics: false,
        },
      },
      {},
    );

    await expect(handler(request)).rejects.toThrow('DynamoDB error');
  });
});
