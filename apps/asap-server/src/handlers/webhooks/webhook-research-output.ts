import { EventBridge } from 'aws-sdk';
import { framework as lambda } from '@asap-hub/services-common';
import { ResearchOutput, WebhookPayload } from '@asap-hub/squidex';
import { Handler } from '../../utils/types';
import { http } from '../../utils/instrumented-framework';
import validateRequest from '../../utils/validate-squidex-request';
import { eventBus, eventSource } from '../../config';

export const researchOutputWebhookFactory = (
  eventBridge: EventBridge,
): Handler =>
  http(
    async (
      request: lambda.Request<WebhookPayload<ResearchOutput>>,
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

export type ResearchOutputEventType =
  | 'ResearchOutputCreated'
  | 'ResearchOutputUpdated';

const getEventType = (
  customType: string,
): ResearchOutputEventType | undefined => {
  if (customType === 'ResearchOutputsPublished') {
    return 'ResearchOutputCreated';
  }

  if (customType === 'ResearchOutputsUpdated') {
    return 'ResearchOutputUpdated';
  }

  return undefined;
};

const eventBridge = new EventBridge();
export const handler: Handler = researchOutputWebhookFactory(eventBridge);
