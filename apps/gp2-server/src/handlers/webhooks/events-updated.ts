/* istanbul ignore file */
import { Handler } from 'aws-lambda';

import { webhookEventUpdatedHandlerFactory } from '@asap-hub/server-common';
import { SQSClient } from '@aws-sdk/client-sqs';
import { googleApiToken, googleCalenderEventQueueUrl } from '../../config';
import logger from '../../utils/logger';
import { sentryWrapper } from '../../utils/sentry-wrapper';

const sqs = new SQSClient();
export const handler: Handler = sentryWrapper(
  webhookEventUpdatedHandlerFactory(
    sqs,
    { googleApiToken, googleCalenderEventQueueUrl },
    logger,
  ),
);
