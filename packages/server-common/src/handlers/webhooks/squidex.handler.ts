import { WebhookDetail, WebhookDetailType } from '@asap-hub/model';
import { framework as lambda } from '@asap-hub/services-common';
import { SquidexWebhookPayload } from '@asap-hub/squidex';
import { EventBridge } from '@aws-sdk/client-eventbridge';
import { Logger, validateSquidexRequest } from '../../utils';

const getDetailFromRequest = (
  request: lambda.Request<SquidexWebhookPayload<unknown>>,
): WebhookDetail<SquidexWebhookPayload<unknown>> => ({
  resourceId: request.payload.payload.id,
  ...request.payload,
});

export const squidexHandlerFactory =
  (
    eventBridge: EventBridge,
    logger: Logger,
    eventBus: string,
    eventSource: string,
    squidexSharedSecret: string,
  ): ((
    request: lambda.Request<SquidexWebhookPayload<unknown>>,
  ) => Promise<{ statusCode: number }>) =>
  async (request) => {
    validateSquidexRequest(request, squidexSharedSecret);

    const { type } = request.payload;
    logger.debug(`Event type ${type}`);

    if (!type) {
      return {
        statusCode: 204,
      };
    }

    const detail = getDetailFromRequest(request);

    await eventBridge.putEvents({
      Entries: [
        {
          EventBusName: eventBus,
          Source: eventSource,
          DetailType: type satisfies WebhookDetailType,
          Detail: JSON.stringify(detail),
        },
      ],
    });

    return {
      statusCode: 200,
    };
  };
