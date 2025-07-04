/* istanbul ignore file */
import { generatePresignedUrlHandlerFactory } from '@asap-hub/server-common';
import { framework } from '@asap-hub/services-common';
import { Handler } from 'aws-lambda';

import { filesBucket, region } from '../../config';
import logger from '../../utils/logger';
import { sentryWrapper } from '../../utils/sentry-wrapper';

export const generatePresignedUrlHandler = framework.http(
  generatePresignedUrlHandlerFactory(logger, filesBucket, region),
);

export const handler: Handler = sentryWrapper(generatePresignedUrlHandler);
