import { framework as lambda } from '@asap-hub/services-common';
import { ExternalAuthor, WebhookPayload } from '@asap-hub/squidex';
import { EventBridge } from 'aws-sdk';
import { eventBus, eventSource } from '../../config';
import logger from '../../utils/logger';
import { Handler } from '../../utils/types';
import validateRequest from '../../utils/validate-squidex-request';

export const externalAuthorWebhookFactory = (
  eventBridge: EventBridge,
): Handler =>
  lambda.http(
    async (request: lambda.Request<WebhookPayload<ExternalAuthor>>) => {
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
    },
  );

const externalAuthorEventTypes = [
  'ExternalAuthorPublished',
  'ExternalAuthorUpdated',
  'ExternalAuthorDeleted',
] as const;
export type ExternalAuthorEventType = typeof externalAuthorEventTypes[number];

export type ExternalAuthorSquidexEventType =
  | 'ExternalAuthorsCreated'
  | 'ExternalAuthorsPublished'
  | 'ExternalAuthorsUpdated'
  | 'ExternalAuthorsUnpublished'
  | 'ExternalAuthorsDeleted';

const getEventType = (
  customType: string,
): ExternalAuthorEventType | undefined => {
  switch (customType) {
    case 'ExternalAuthorsPublished':
      return 'ExternalAuthorPublished';

    case 'ExternalAuthorsUpdated':
      return 'ExternalAuthorUpdated';

    case 'ExternalAuthorsUnpublished':
      return 'ExternalAuthorDeleted';

    case 'ExternalAuthorsDeleted':
      return 'ExternalAuthorDeleted';

    default:
      return undefined;
  }
};

export type SquidexWebhookExternalAuthorPayload = {
  type: ExternalAuthorSquidexEventType;
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
export const handler: Handler = externalAuthorWebhookFactory(eventBridge);
