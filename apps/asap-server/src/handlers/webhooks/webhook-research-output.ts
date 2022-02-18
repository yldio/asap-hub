import { EventBridge } from 'aws-sdk';
import { framework as lambda } from '@asap-hub/services-common';
import { ResearchOutput, WebhookPayload } from '@asap-hub/squidex';
import { Handler } from '../../utils/types';
import validateRequest from '../../utils/validate-squidex-request';
import { eventBus, eventSource } from '../../config';
import logger from '../../utils/logger';

export const researchOutputWebhookFactory = (
  eventBridge: EventBridge,
): Handler =>
  lambda.http(
    async (request: lambda.Request<WebhookPayload<ResearchOutput>>) => {
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

export type SquidexResearchOutputsEventType =
  | 'ResearchOutputsPublished'
  | 'ResearchOutputsUpdated'
  | 'ResearchOutputsUnpublished'
  | 'ResearchOutputsDeleted';

export type ResearchOutputEventType =
  | 'ResearchOutputCreated'
  | 'ResearchOutputUpdated'
  | 'ResearchOutputDeleted';

const getEventType = (
  customType: string,
): ResearchOutputEventType | undefined => {
  switch (customType) {
    case 'ResearchOutputsPublished':
      return 'ResearchOutputCreated';

    case 'ResearchOutputsUpdated':
      return 'ResearchOutputUpdated';

    case 'ResearchOutputsUnpublished':
      return 'ResearchOutputDeleted';

    case 'ResearchOutputsDeleted':
      return 'ResearchOutputDeleted';

    default:
      return undefined;
  }
};

const eventBridge = new EventBridge();
export const handler: Handler = researchOutputWebhookFactory(eventBridge);
