import { SQS } from 'aws-sdk';
import { EventBridgeHandler } from 'aws-lambda';
import { UserPayload } from '../event-bus';
import logger from '../../utils/logger';
import { sentryWrapper } from '../../utils/sentry-wrapper';
import { inviteUserQueueUrl } from '../../config';

const sqs = new SQS();

export const handler: EventBridgeHandler<
  'UsersPublished',
  UserPayload
> = async (event) => {
  try {
    await sqs
      .sendMessage({
        QueueUrl: inviteUserQueueUrl,
        MessageBody: JSON.stringify(event),
      })
      .promise();
  } catch (error) {
    logger.error(error, 'Failed to forward event to SQS');
    throw error;
  }
};

export default sentryWrapper(handler);
