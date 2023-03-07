import 'source-map-support/register';
import { squidexHandlerFactory } from '@asap-hub/server-common';
import { framework as lambda } from '@asap-hub/services-common';
import { Handler } from 'aws-lambda/handler';
import { EventBridge } from 'aws-sdk';
import { eventBus, eventSource, squidexSharedSecret } from '../../config';
import logger from '../../utils/logger';
import { sentryWrapper } from '../../utils/sentry-wrapper';

export const squidexWebhookFactory = (
  eventBridge: EventBridge,
): lambda.Handler => {
  const squidexHandler = squidexHandlerFactory(
    eventBridge,
    logger,
    eventBus,
    eventSource,
    squidexSharedSecret,
  );

  return lambda.http(squidexHandler);
};

const eventBridge = new EventBridge(
  /* istanbul ignore next */
  process.env.IS_OFFLINE
    ? {
        endpoint: 'http://127.0.0.1:4010',
        accessKeyId: 'YOURKEY',
        secretAccessKey: 'YOURSECRET',
      }
    : undefined,
);

export const handler: Handler = sentryWrapper(
  squidexWebhookFactory(eventBridge),
);
