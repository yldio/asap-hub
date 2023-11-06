import { contentfulPollerHandlerFactory } from '@asap-hub/server-common';
import { EventBridge } from '@aws-sdk/client-eventbridge';
import { APIGatewayEvent, Handler } from 'aws-lambda';
import 'source-map-support/register';
import {
  contentfulAccessToken,
  contentfulEnvId,
  contentfulSpaceId,
  eventBus,
  eventSource,
} from '../../config';
import logger from '../../utils/logger';
import { sentryWrapper } from '../../utils/sentry-wrapper';

export const contentfulPollerFactory = (
  eventBridge: EventBridge,
): ReturnType<typeof contentfulPollerHandlerFactory> =>
  contentfulPollerHandlerFactory(
    eventBridge,
    {
      eventBus,
      eventSource,
      accessToken: contentfulAccessToken,
      environment: contentfulEnvId,
      space: contentfulSpaceId,
    },
    logger,
  );

const eventBridge = new EventBridge({});

export const handler: Handler<APIGatewayEvent> = sentryWrapper(
  contentfulPollerFactory(eventBridge),
);
