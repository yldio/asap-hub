import { framework as lambda } from '@asap-hub/services-common';
import { User, WebhookPayload } from '@asap-hub/squidex';
import { EventBridge } from 'aws-sdk';
import { eventBus, eventSource } from '../../config';
import { http } from '../../utils/instrumented-framework';
import { Handler } from '../../utils/types';
import logger from '../../utils/logger';
import validateRequest from '../../utils/validate-squidex-request';

export const userWebhookFactory = (eventBridge: EventBridge): Handler =>
  http(
    async (
      request: lambda.Request<WebhookPayload<User>>,
    ): Promise<lambda.Response> => {
      validateRequest(request);

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
    },
  );

export type UserEventType = 'UserCreated' | 'UserUpdated' | 'UserDeleted';

export type UserWebhookPayload = {
  type: UserEventType;
  payload: {
    $type: 'EnrichedContentEvent';
    type: 'Published' | 'Updated' | 'Unpublished' | 'Deleted';
    id: string;
  };
};

const getEventType = (customType: string): UserEventType | undefined => {
  switch (customType) {
    case 'UsersPublished':
      return 'UserCreated';

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

const eventBridge = new EventBridge();
export const handler: Handler = userWebhookFactory(eventBridge);
