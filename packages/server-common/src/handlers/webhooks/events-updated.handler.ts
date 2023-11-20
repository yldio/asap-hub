import { SendMessageCommand, SQSClient } from '@aws-sdk/client-sqs';
import { APIGatewayProxyEventV2, APIGatewayProxyResult } from 'aws-lambda';
import pino from 'pino';
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

    const generateResponse = (
      statusCode: number,
      body: string,
      logFn?: pino.LogFn,
    ) => {
      if (logFn) {
        logFn(body);
      }
      return {
        statusCode,
        body,
      };
    };
    const channelToken = request.headers['x-goog-channel-token'];
    if (!channelToken) {
      return generateResponse(
        401,
        'Missing x-goog-channel-token header',
        logger.error,
      );
    }

    if (channelToken !== googleApiToken) {
      return generateResponse(403, 'Channel token doesnt match', logger.error);
    }

    const resourceId = request.headers['x-goog-resource-id'];
    if (!resourceId) {
      return generateResponse(
        400,
        'Missing x-goog-resource-id header',
        logger.error,
      );
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

      return generateResponse(200, 'Success');
    } catch (err) {
      logger.error(
        `An error occurred putting onto the SQS ${googleCalenderEventQueueUrl}`,
      );
      if (err instanceof Error) {
        logger.error(`The error message: ${err.message}`);
      }
      return generateResponse(500, 'Failure');
    }
  };
