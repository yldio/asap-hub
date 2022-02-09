import { framework as lambda } from '@asap-hub/services-common';
import { User, WebhookPayload } from '@asap-hub/squidex';
import { EventBridge } from 'aws-sdk';
import { eventBus, eventSource } from '../../config';
import { Handler } from '../../utils/types';
import validateRequest from '../../utils/validate-squidex-request';

export const userWebhookFactory = (eventBridge: EventBridge): Handler =>
  lambda.http(async (request: lambda.Request<WebhookPayload<User>>) => {
    await validateRequest(request);

    if (request.payload?.type !== 'UsersPublished') {
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
            DetailType: 'UserPublished',
            Detail: JSON.stringify(request.payload),
          },
        ],
      })
      .promise();

    return {
      statusCode: 200,
    };
  });

const eventBridge = new EventBridge();
export const handler: Handler = userWebhookFactory(eventBridge);
