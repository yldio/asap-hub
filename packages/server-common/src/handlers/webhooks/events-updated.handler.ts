import { SendMessageCommand, SQSClient } from '@aws-sdk/client-sqs';
import { APIGatewayProxyEventV2, APIGatewayProxyResult } from 'aws-lambda';
import { Logger } from '../../utils';

type Config = { googleApiToken: string; googleCalenderEventQueueUrl: string };
export const webhookEventUpdatedHandlerFactory =
  (
    sqs: SQSClient,
    { googleApiToken, googleCalenderEventQueueUrl }: Config,
    logger: Logger,
  ): ((event: APIGatewayProxyEventV2) => Promise<APIGatewayProxyResult>) =>
  async (request) => {
    logger.debug(JSON.stringify(request, null, 2), 'Request');

    const channelToken = request.headers['x-goog-channel-token'];
    if (!channelToken) {
      return {
        statusCode: 401,
        body: 'Missing x-goog-channel-token header',
      };
    }

    if (channelToken !== googleApiToken) {
      return {
        statusCode: 403,
        body: 'Channel token doesnt match',
      };
    }

    const resourceId = request.headers['x-goog-resource-id'];
    if (!resourceId) {
      return {
        statusCode: 400,
        body: 'Missing x-goog-resource-id header',
      };
    }
    const channelId = request.headers['x-goog-channel-id'];

    try {
      const command = new SendMessageCommand({
        QueueUrl: googleCalenderEventQueueUrl,
        MessageAttributes: {
          ResourceId: {
            DataType: 'String',
            StringValue: resourceId,
          },
          ChannelId: {
            DataType: 'String',
            StringValue: channelId,
          },
        },
        MessageBody: JSON.stringify(request),
      });
      await sqs.send(command);
      logger.debug(
        `Event added to queue ${googleCalenderEventQueueUrl} resourceId: ${resourceId} channelId: ${channelId}`,
      );

      return {
        statusCode: 200,
        body: 'Success',
      };
    } catch (err) {
      logger.error(
        `An error occurred putting onto the SQS ${googleCalenderEventQueueUrl}`,
      );
      if (err instanceof Error) {
        logger.error(`The error message: ${err.message}`);
      }
      return {
        statusCode: 500,
        body: 'Failure',
      };
    }
  };
