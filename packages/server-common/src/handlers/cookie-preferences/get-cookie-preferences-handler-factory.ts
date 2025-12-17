import { framework as lambda } from '@asap-hub/services-common';
import { GetItemCommand } from '@aws-sdk/client-dynamodb';
import Boom from '@hapi/boom';

import { Logger } from '../../utils';
import { createDynamoDBClient } from './dynamo-init';
import { handleDynamoDBError } from './error-handler';

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

    const client = createDynamoDBClient(logger);
    const command = new GetItemCommand({
      TableName: tableName,
      Key: {
        cookieId: { S: request.params.cookieId },
      },
    });

    let item;
    try {
      const result = await client.send(command);
      item = result.Item;
    } catch (error) {
      throw handleDynamoDBError(error, logger, 'get', {
        tableName,
        cookieId: request.params.cookieId,
      });
    }

    if (
      !item ||
      !(
        item.preferences?.M?.analytics?.BOOL !== undefined &&
        typeof item.preferences.M.analytics.BOOL === 'boolean'
      ) ||
      !(
        item.preferences?.M?.essential?.BOOL !== undefined &&
        typeof item.preferences.M.essential.BOOL === 'boolean'
      ) ||
      !item.cookieId?.S ||
      !item.createdAt?.S
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

    logger.info(`${JSON.stringify(item)}`);

    return {
      statusCode: 200,
      payload: {
        createdAt: item.createdAt.S,
        cookieId: item.cookieId.S,
        preferences: {
          analytics: item.preferences.M?.analytics?.BOOL,
          essential: item.preferences.M?.essential?.BOOL,
        },
      },
    };
  };
