import { framework as lambda } from '@asap-hub/services-common';
import { Lab, WebhookPayload } from '@asap-hub/squidex';
import { EventBridge } from 'aws-sdk';
import { eventBus, eventSource } from '../../config';
import logger from '../../utils/logger';
import { Handler } from '../../utils/types';
import validateRequest from '../../utils/validate-squidex-request';

export const labsWebhookFactory = (eventBridge: EventBridge): Handler =>
  lambda.http(async (request: lambda.Request<WebhookPayload<Lab>>) => {
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

const labEventTypes = ['LabPublished', 'LabUpdated', 'LabDeleted'] as const;
export type LabEventType = typeof labEventTypes[number];

const labSquidexEventTypes = [
  'LabsPublished',
  'LabsUpdated',
  'LabsUnpublished',
  'LabsDeleted',
];
export type SquidexLabEventType = typeof labSquidexEventTypes[number];

const getEventType = (
  customType: SquidexLabEventType | unknown,
): LabEventType | undefined => {
  switch (customType) {
    case 'LabsPublished':
      return 'LabPublished';

    case 'LabsUpdated':
      return 'LabUpdated';

    case 'LabsUnpublished':
      return 'LabDeleted';

    case 'LabsDeleted':
      return 'LabDeleted';

    default:
      return undefined;
  }
};

const eventBridge = new EventBridge();
export const handler: Handler = labsWebhookFactory(eventBridge);
