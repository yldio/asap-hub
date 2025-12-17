import { framework as lambda } from '@asap-hub/services-common';
import { PutItemCommand } from '@aws-sdk/client-dynamodb';

import { Logger } from '../../utils';
import { validateCookieCreateData } from '../../validation';
import { createDynamoDBClient } from './dynamo-init';
import { handleDynamoDBError } from './error-handler';

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

    const client = createDynamoDBClient(logger);
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

    try {
      const response = await client.send(command);
      logger.info(
        `Successfully saved cookie preferences for cookieId: ${cookieId}`,
      );
      return {
        statusCode: 200,
        body: JSON.stringify(response),
      };
    } catch (error) {
      throw handleDynamoDBError(error, logger, 'save', {
        tableName,
        cookieId,
      });
    }
  };
