import { framework as lambda } from '@asap-hub/services-common';
import { User, WebhookPayload } from '@asap-hub/squidex';
import { EventBridge } from 'aws-sdk';
import { eventBus, eventSource } from '../../config';
import logger from '../../utils/logger';
import { Handler } from '../../utils/types';
import validateRequest from '../../utils/validate-squidex-request';

export const userWebhookFactory = (eventBridge: EventBridge): Handler =>
  lambda.http(async (request: lambda.Request<WebhookPayload<User>>) => {
    await validateRequest(request);

    const type = getEventType(request.payload.type);
    logger.debug(`Event type ${type}`);

    if (!type) {
      return {
        statusCode: 204,
      };
    }

    await eventBridge
      .putEvents({
        Entries: [
          {
            EventBusName: eventBus,
            Source: eventSource,
            DetailType: type,
            Detail: JSON.stringify(request.payload),
          },
        ],
      })
      .promise();

    return {
      statusCode: 200,
    };
  });

const userEventTypes = ['UserPublished', 'UserUpdated', 'UserDeleted'] as const;
export type UserEventType = typeof userEventTypes[number];

export type UserSquidexEventType =
  | 'UsersCreated'
  | 'UsersPublished'
  | 'UsersUpdated'
  | 'UsersUnpublished'
  | 'UsersDeleted';

const getEventType = (customType: string): UserEventType | undefined => {
  switch (customType) {
    case 'UsersPublished':
      return 'UserPublished';

    case 'UsersUpdated':
      return 'UserUpdated';

    case 'UsersUnpublished':
      return 'UserDeleted';

    case 'UsersDeleted':
      return 'UserDeleted';

    default:
      return undefined;
  }
};

export type SquidexWebhookUserPayload = {
  type: UserSquidexEventType;
  timestamp: string;
  payload: {
    $type: 'EnrichedContentEvent';
    type: 'Published' | 'Updated' | 'Unpublished' | 'Deleted' | 'Created';
    id: string;
    created: string;
    lastModified: string;
    version: number;
    data: { [x: string]: { iv: unknown } | null };
  };
};

const eventBridge = new EventBridge();
export const handler: Handler = userWebhookFactory(eventBridge);
