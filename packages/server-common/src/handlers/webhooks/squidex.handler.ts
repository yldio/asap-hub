import { framework as lambda } from '@asap-hub/services-common';
import { WebhookPayload } from '@asap-hub/squidex';
import { EventBridge } from 'aws-sdk';
import { Logger, validateSquidexRequest } from '../../utils';

export const createSquidexHandler =
  (
    eventBridge: EventBridge,
    logger: Logger,
    eventBus: string,
    eventSource: string,
    squidexSharedSecret: string,
  ) =>
  async (request: lambda.Request<WebhookPayload<unknown>>) => {
    validateSquidexRequest(request, squidexSharedSecret);

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
  };
