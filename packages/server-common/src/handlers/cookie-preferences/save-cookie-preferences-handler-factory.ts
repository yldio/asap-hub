import { framework as lambda } from '@asap-hub/services-common';
import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';

import { Logger } from '../../utils';
import { validateCookieCreateData } from '../../validation';

export const saveCookiePreferencesHandlerFactory =
  (
    logger: Logger,
    tableName: string,
  ): ((
    request: lambda.Request,
  ) => Promise<{ statusCode: number; body: string }>) =>
  async (request: lambda.Request) => {
    logger.debug(`request: ${JSON.stringify(request)}`);

    const { cookieId, preferences } = validateCookieCreateData(
      request.payload as Record<string, unknown>,
    );

    const client = new DynamoDBClient();
    const command = new PutItemCommand({
      TableName: tableName,
      Item: {
        cookieId: { S: cookieId },
        preferences: {
          M: {
            essential: { BOOL: preferences.essential },
            analytics: { BOOL: preferences.analytics },
          },
        },
        createdAt: { S: new Date().toISOString() },
      },
    });

    const response = await client.send(command);

    return {
      statusCode: 200,
      body: JSON.stringify(response),
    };
  };
