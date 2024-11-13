import { NotFoundError } from '@asap-hub/errors';
import { framework as lambda } from '@asap-hub/services-common';
import { DynamoDBClient, GetItemCommand } from '@aws-sdk/client-dynamodb';

import { Logger } from '../../utils';

export const getCookiePreferencesHandlerFactory =
  (
    logger: Logger,
    tableName: string,
  ): ((request: lambda.Request) => Promise<{
    statusCode: number;
    body:
      | string
      | {
          createdAt: string;
          cookieId: string;
          preferences: {
            analytics: boolean;
            essential: boolean;
          };
        };
  }>) =>
  async (request: lambda.Request) => {
    logger.debug(`request: ${JSON.stringify(request)}`);

    if (!request.params?.cookieId) {
      return {
        statusCode: 400,
        body: 'cookieId is required',
      };
    }

    const client = new DynamoDBClient();
    const command = new GetItemCommand({
      TableName: tableName,
      Key: {
        cookieId: { S: request.params.cookieId },
      },
    });

    const { Item } = await client.send(command);

    if (
      !Item ||
      !(
        Item.preferences?.M?.analytics?.BOOL &&
        typeof Item.preferences.M.analytics.BOOL === 'boolean'
      ) ||
      !(
        Item.preferences?.M?.essential?.BOOL &&
        typeof Item.preferences.M.essential.BOOL === 'boolean'
      ) ||
      !Item.cookieId?.S ||
      !Item.createdAt?.S
    ) {
      throw new NotFoundError(
        undefined,
        `Cookie with id ${request.params.cookieId} not found`,
      );
    }

    logger.info(`${JSON.stringify(Item)}`);

    return {
      statusCode: 200,
      body: {
        createdAt: Item.createdAt.S,
        cookieId: Item.cookieId.S,
        preferences: {
          analytics: Item.preferences.M?.analytics?.BOOL,
          essential: Item.preferences.M?.essential?.BOOL,
        },
      },
    };
  };
