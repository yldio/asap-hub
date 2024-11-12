import { framework as lambda } from '@asap-hub/services-common';
import { DynamoDBClient, GetItemCommand } from '@aws-sdk/client-dynamodb';

import { Logger } from '../../utils';

export const getCookiePreferencesHandlerFactory =
  (
    logger: Logger,
    tableName: string,
  ): ((
    request: lambda.Request,
  ) => Promise<{ statusCode: number; body: string }>) =>
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

    const response = await client.send(command);

    return {
      statusCode: 200,
      body: JSON.stringify(response.Item ? response.Item.preferences : {}),
    };
  };
