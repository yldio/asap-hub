import { contentfulHandlerFactory } from '@asap-hub/server-common';
import { framework as lambda } from '@asap-hub/services-common';
import { EventBridge } from '@aws-sdk/client-eventbridge';
import { APIGatewayEvent, Handler } from 'aws-lambda';
import 'source-map-support/register';
import {
  contentfulAccessToken,
  contentfulEnvId,
  contentfulSpaceId,
  contentfulWebhookAuthenticationToken,
  eventBus,
  eventSource,
} from '../../config';
import logger from '../../utils/logger';
import { sentryWrapper } from '../../utils/sentry-wrapper';

export const contentfulWebhookFactory = (
  eventBridge: EventBridge,
): lambda.Handler => {
  const handler = contentfulHandlerFactory(
    contentfulWebhookAuthenticationToken,
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
  return lambda.http(handler);
};

const eventBridge = new EventBridge({});

export const handler: Handler<APIGatewayEvent> = sentryWrapper(
  contentfulWebhookFactory(eventBridge),
);
