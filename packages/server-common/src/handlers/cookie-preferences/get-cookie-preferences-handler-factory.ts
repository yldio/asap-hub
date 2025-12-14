import { framework as lambda } from '@asap-hub/services-common';
import { DynamoDBClient, GetItemCommand } from '@aws-sdk/client-dynamodb';
import Boom from '@hapi/boom';

import { Logger } from '../../utils';

export const getCookiePreferencesHandlerFactory =
  (
    logger: Logger,
    tableName: string,
  ): ((request: lambda.Request) => Promise<{
    statusCode: number;
    payload:
      | string
      | {
          createdAt: string;
          cookieId: string;
          preferences: {
            analytics: boolean;
            essential: boolean;
          };
        }
      | {
          error: string;
          message: string;
          statusCode: number;
        };
  }>) =>
  async (request: lambda.Request) => {
    logger.debug(`request: ${JSON.stringify(request)}`);

    if (!request.params?.cookieId) {
      return {
        statusCode: 400,
        payload: 'cookieId is required',
      };
    }

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
    const command = new GetItemCommand({
      TableName: tableName,
      Key: {
        cookieId: { S: request.params.cookieId },
      },
    });

    let Item;
    try {
      const result = await client.send(command);
      Item = result.Item;
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
        `Failed to get cookie preferences from DynamoDB: ${errorName}`,
        {
          error: errorMessage,
          errorName,
          tableName,
          endpoint: dynamoDbConfig.endpoint,
          cookieId: request.params.cookieId,
          // Log error code if available (for AWS SDK errors)
          errorCode: (error as { $metadata?: { httpStatusCode?: number } })
            ?.$metadata?.httpStatusCode,
        },
      );
      // Throw Boom error to preserve error message - this will be serialized to browser response
      const boomMessage = errorMessage || errorName || 'Unknown error';
      throw Boom.badImplementation(boomMessage);
    }

    if (
      !Item ||
      !(
        Item.preferences?.M?.analytics?.BOOL !== undefined &&
        typeof Item.preferences.M.analytics.BOOL === 'boolean'
      ) ||
      !(
        Item.preferences?.M?.essential?.BOOL !== undefined &&
        typeof Item.preferences.M.essential.BOOL === 'boolean'
      ) ||
      !Item.cookieId?.S ||
      !Item.createdAt?.S
    ) {
      // Cookie not found - return 404 response
      // Frontend will handle this gracefully and use locally stored values
      const notFoundError = Boom.notFound(
        `Cookie with id ${request.params.cookieId} not found`,
      );
      return {
        statusCode: notFoundError.output.statusCode,
        payload: {
          error: notFoundError.output.payload.error,
          message: notFoundError.output.payload.message,
          statusCode: notFoundError.output.statusCode,
        },
      };
    }

    logger.info(`${JSON.stringify(Item)}`);

    return {
      statusCode: 200,
      payload: {
        createdAt: Item.createdAt.S,
        cookieId: Item.cookieId.S,
        preferences: {
          analytics: Item.preferences.M?.analytics?.BOOL,
          essential: Item.preferences.M?.essential?.BOOL,
        },
      },
    };
  };
