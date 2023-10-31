import { contentfulHandlerFactory } from '@asap-hub/server-common';
import { framework as lambda } from '@asap-hub/services-common';
import { SQSClient } from '@aws-sdk/client-sqs';
import { APIGatewayEvent, Handler } from 'aws-lambda';
import 'source-map-support/register';
import {
  contentfulPollerQueueUrl,
  contentfulWebhookAuthenticationToken as webhookAuthenticationToken,
} from '../../config';
import logger from '../../utils/logger';
import { sentryWrapper } from '../../utils/sentry-wrapper';

export const contentfulWebhookFactory = (sqs: SQSClient): lambda.Handler => {
  const handler = contentfulHandlerFactory(
    sqs,
    {
      webhookAuthenticationToken,
      contentfulPollerQueueUrl,
    },
    logger,
  );
  return lambda.http(handler);
};

const sqs = new SQSClient();

export const handler: Handler<APIGatewayEvent> = sentryWrapper(
  contentfulWebhookFactory(sqs),
);
