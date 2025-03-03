/* istanbul ignore file */
import { getPresignedUrlHandlerFactory } from '@asap-hub/server-common';
import { framework as lambda } from '@asap-hub/services-common';
import { Handler } from 'aws-lambda';

import { filesBucket, region } from '../../config';
import logger from '../../utils/logger';
import { sentryWrapper } from '../../utils/sentry-wrapper';

export const getPresignedUrlHandler = lambda.http(
  getPresignedUrlHandlerFactory(logger, filesBucket, region),
);

export const handler: Handler = sentryWrapper(getPresignedUrlHandler);
