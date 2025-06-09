import {
  UserPayload,
  forwardInviteEventToQueue,
} from '@asap-hub/server-common';
import { EventBridgeEvent, EventBridgeHandler } from 'aws-lambda';
import { inviteUserQueueUrl, region } from '../../config';
import logger from '../../utils/logger';
import { sentryWrapper } from '../../utils/sentry-wrapper';

const rawHandlerCRN: EventBridgeHandler<
  'UsersPublished',
  UserPayload,
  void
> = async (event: EventBridgeEvent<'UsersPublished', UserPayload>) => {
  try {
    await forwardInviteEventToQueue({
      event,
      queueUrl: inviteUserQueueUrl,
      region,
    });
  } catch (error) {
    logger.error(error, 'Failed to forward event to SQS');
    throw error;
  }
};

export const handler = sentryWrapper(rawHandlerCRN);
