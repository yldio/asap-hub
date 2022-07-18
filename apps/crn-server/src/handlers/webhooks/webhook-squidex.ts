import { validateSquidexRequest } from '@asap-hub/server-common';
import { framework as lambda } from '@asap-hub/services-common';
import { WebhookPayload } from '@asap-hub/squidex';
import { EventBridge } from 'aws-sdk';
import { eventBus, eventSource, squidexSharedSecret } from '../../config';
import logger from '../../utils/logger';

export const squidexWebhookFactory = (
  eventBridge: EventBridge,
): lambda.Handler =>
  lambda.http(async (request: lambda.Request<WebhookPayload<unknown>>) => {
    await validateSquidexRequest(request, squidexSharedSecret);

    const { type } = request.payload;
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

const eventBridge = new EventBridge();
export const handler: lambda.Handler = squidexWebhookFactory(eventBridge);
