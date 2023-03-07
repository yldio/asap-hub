/* istanbul ignore file */
import { createInvalidateCacheHandler } from '@asap-hub/server-common';
import { cloudfrontDistributionId } from '../../config';
import logger from '../../utils/logger';
import { sentryWrapper } from '../../utils/sentry-wrapper';

export const handler = sentryWrapper(
  createInvalidateCacheHandler(cloudfrontDistributionId, logger),
);
