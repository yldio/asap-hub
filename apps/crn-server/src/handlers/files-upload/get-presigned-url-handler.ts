/* istanbul ignore file */
import { getPresignedUrlHandlerFactory } from '@asap-hub/server-common';
import { framework } from '@asap-hub/services-common';
import { Handler } from 'aws-lambda';

import { filesBucket, dataBucket, region } from '../../config';
import logger from '../../utils/logger';
import { sentryWrapper } from '../../utils/sentry-wrapper';

export const getPresignedUrlHandler = framework.http(
  getPresignedUrlHandlerFactory(logger, filesBucket, dataBucket, region),
);

export const handler: Handler = sentryWrapper(getPresignedUrlHandler);
