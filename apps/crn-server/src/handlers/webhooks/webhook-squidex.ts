import { createSquidexHandler } from '@asap-hub/server-common';
import { framework as lambda } from '@asap-hub/services-common';
import { EventBridge } from 'aws-sdk';
import { eventBus, eventSource, squidexSharedSecret } from '../../config';
import logger from '../../utils/logger';

const eventBridge = new EventBridge();
const squidexHandler = createSquidexHandler(
  eventBridge,
  logger,
  eventBus,
  eventSource,
  squidexSharedSecret,
);
export const handler: lambda.Handler = lambda.http(squidexHandler);
