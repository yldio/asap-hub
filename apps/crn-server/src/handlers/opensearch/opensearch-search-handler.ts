/* istanbul ignore file */
import { opensearchSearchHandlerFactory } from '@asap-hub/server-common';
import { framework } from '@asap-hub/services-common';
import { Handler } from 'aws-lambda';
import logger from '../../utils/logger';
import { sentryWrapper } from '../../utils/sentry-wrapper';
import { opensearchUsername, opensearchPassword } from '../../config';

export const opensearchSearchHandler = framework.http(
  opensearchSearchHandlerFactory(
    logger,
    opensearchUsername,
    opensearchPassword,
  ),
);

export const handler: Handler = sentryWrapper(opensearchSearchHandler);
