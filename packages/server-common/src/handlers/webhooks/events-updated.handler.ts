import { framework as lambda } from '@asap-hub/services-common';
import { SendMessageCommand, SQSClient } from '@aws-sdk/client-sqs';
import Boom from '@hapi/boom';
import { Logger } from '../../utils';

type Config = { googleApiToken: string; googleCalenderEventQueueUrl: string };
export const webhookEventUpdatedHandlerFactory = (
  sqs: SQSClient,
  { googleApiToken, googleCalenderEventQueueUrl }: Config,
  logger: Logger,
): lambda.Handler => {
  return lambda.http(async (request) => {
    logger.debug(JSON.stringify(request, null, 2), 'Request');

    const channelToken = request.headers['x-goog-channel-token'];
    if (!channelToken) {
      throw Boom.unauthorized('Missing x-goog-channel-token header');
    }

    if (channelToken !== googleApiToken) {
      throw Boom.forbidden('Channel token doesnt match');
    }

    const resourceId = request.headers['x-goog-resource-id'];
    if (!resourceId) {
      throw Boom.badRequest('Missing x-goog-resource-id header');
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
        MessageBody: '',
      });
      await sqs.send(command);
      logger.debug(
        `Event added to queue ${googleCalenderEventQueueUrl} resourceId: ${resourceId} channelId: ${channelId}`,
      );

      return {
        statusCode: 200,
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
      };
    }
  });
};
