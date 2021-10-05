import { framework as lambda } from '@asap-hub/services-common';
import { Team, WebhookPayload } from '@asap-hub/squidex';
import { EventBridge } from 'aws-sdk';
import { eventBus, eventSource } from '../../config';
import { http } from '../../utils/instrumented-framework';
import { Handler } from '../../utils/types';
import validateRequest from '../../utils/validate-squidex-request';

export const teamsWebhookFactory = (eventBridge: EventBridge): Handler =>
  http(
    async (
      request: lambda.Request<WebhookPayload<Team>>,
    ): Promise<lambda.Response> => {
      await validateRequest(request);

      const type = getEventType(request.payload.type);

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

export type TeamsEventType = 'TeamsCreated' | 'TeamsUpdated';

const getEventType = (customType: string): TeamsEventType | undefined => {
  if (customType === 'TeamsCreated') {
    return 'TeamsCreated';
  }

  if (customType === 'TeamsUpdated') {
    return 'TeamsUpdated';
  }

  return undefined;
};

const eventBridge = new EventBridge();
export const handler: Handler = teamsWebhookFactory(eventBridge);
