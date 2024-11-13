/* istanbul ignore file */
import { getCookiePreferencesHandlerFactory } from '@asap-hub/server-common';
import { framework as lambda } from '@asap-hub/services-common';
import { Handler } from 'aws-lambda';

import { cookiePreferencesTableName } from '../../config';
import logger from '../../utils/logger';
import { sentryWrapper } from '../../utils/sentry-wrapper';

export const getCookiePreferencesHandler = lambda.http(
  getCookiePreferencesHandlerFactory(logger, cookiePreferencesTableName),
);

export const handler: Handler = sentryWrapper(getCookiePreferencesHandler);
