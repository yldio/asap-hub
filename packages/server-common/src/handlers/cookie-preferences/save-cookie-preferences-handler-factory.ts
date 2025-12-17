import { framework as lambda } from '@asap-hub/services-common';
import { PutItemCommand } from '@aws-sdk/client-dynamodb';
import Boom from '@hapi/boom';

import { Logger } from '../../utils';
import { validateCookieCreateData } from '../../validation';
import { createDynamoDBClient } from './dynamo-init';

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
      // Extract error message from various error types (Error, AWS SDK errors, etc.)
      let errorMessage = 'Unknown error';
      let errorName = 'Error';

      if (error instanceof Error) {
        errorMessage = error.message || error.name || String(error);
        errorName = error.name || 'Error';
      } else {
        errorMessage = String(error);
      }

      logger.error(
        `Failed to save cookie preferences to DynamoDB: ${errorName}`,
        {
          error: errorMessage,
          errorName,
          tableName,
          cookieId,
          // Log error code if available (for AWS SDK errors)
          errorCode: (error as { $metadata?: { httpStatusCode?: number } })
            ?.$metadata?.httpStatusCode,
        },
      );
      // Throw Boom error to preserve error message - this will be serialized to browser response
      const boomMessage = errorMessage || errorName || 'Unknown error';
      throw Boom.badImplementation(boomMessage);
    }
  };
