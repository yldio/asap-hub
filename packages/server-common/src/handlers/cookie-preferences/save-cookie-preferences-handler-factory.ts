import { framework as lambda } from '@asap-hub/services-common';
import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';
import Boom from '@hapi/boom';

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

    // Use local DynamoDB if LOCAL_DYNAMODB_ENDPOINT is set, or if we're in local/dev environment
    const isLocalEnv =
      process.env.ENVIRONMENT === 'local' ||
      process.env.NODE_ENV === 'development' ||
      process.env.SLS_STAGE === 'local';
    const localEndpoint =
      process.env.LOCAL_DYNAMODB_ENDPOINT ||
      (isLocalEnv ? 'http://localhost:8000' : undefined);

    const dynamoDbConfig = localEndpoint
      ? {
          endpoint: localEndpoint,
          region: process.env.AWS_REGION || 'us-east-1',
          credentials: {
            accessKeyId: 'local',
            secretAccessKey: 'local',
          },
        }
      : {};

    logger.info(
      `DynamoDB config: ${JSON.stringify({
        endpoint: dynamoDbConfig.endpoint || 'default AWS endpoint',
        region: dynamoDbConfig.region || 'default',
        hasLocalEndpoint: !!localEndpoint,
        isLocalEnv,
      })}`,
    );

    const client = new DynamoDBClient(dynamoDbConfig);
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
          endpoint: dynamoDbConfig.endpoint,
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
