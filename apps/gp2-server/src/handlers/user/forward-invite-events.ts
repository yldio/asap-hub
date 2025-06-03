import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';
import { EventBridgeHandler } from 'aws-lambda';
import { inviteUserQueueUrl, region } from '../../config';
import logger from '../../utils/logger';
import { sentryWrapper } from '../../utils/sentry-wrapper';
import { UserPayload } from '../event-bus';

const rawHandler: EventBridgeHandler<
  'UsersPublished',
  UserPayload,
  void
> = async (event) => {
  if (!inviteUserQueueUrl) {
    throw new Error('inviteUserQueueUrl is not set');
  }

  const sqsClient = new SQSClient({ region });

  const command = new SendMessageCommand({
    QueueUrl: inviteUserQueueUrl,
    MessageBody: JSON.stringify(event),
  });

  try {
    await sqsClient.send(command);
  } catch (error) {
    logger.error(error, 'Failed to forward event to SQS');
    throw error;
  }
};

export const handler = sentryWrapper(rawHandler);
