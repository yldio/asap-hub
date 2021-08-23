import { framework as lambda } from '@asap-hub/services-common';
import { User, WebhookPayload } from '@asap-hub/squidex';
import { EventBridge } from 'aws-sdk';
import { eventBus, eventSource } from '../../config';
import { http } from '../../utils/instrumented-framework';
import { Handler } from '../../utils/types';
import validateRequest from '../../utils/validate-squidex-request';

export const userWebhookFactory = (eventBridge: EventBridge): Handler =>
  http(
    async (
      request: lambda.Request<WebhookPayload<User>>,
    ): Promise<lambda.Response> => {
      await validateRequest(request);

      if (request.payload?.type !== 'UsersCreated') {
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
              DetailType: 'UserCreated',
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

const eventBridge = new EventBridge();
export const handler: Handler = userWebhookFactory(eventBridge);
