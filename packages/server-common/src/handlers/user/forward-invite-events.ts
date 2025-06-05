// packages/server-common/src/handlers/forward-invite-events.ts

import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';
import { EventBridgeEvent } from 'aws-lambda';
import { UserPayload } from '../event-bus';

export const forwardInviteEventToQueue = async ({
  event,
  queueUrl,
  region,
}: {
  event: EventBridgeEvent<'UsersPublished', UserPayload>;
  queueUrl: string;
  region: string;
}) => {
  if (!queueUrl) throw new Error('inviteUserQueueUrl is not set');
  const sqsClient = new SQSClient({ region });
  const command = new SendMessageCommand({
    QueueUrl: queueUrl,
    MessageBody: JSON.stringify(event),
  });

  await sqsClient.send(command);
};
