/* istanbul ignore file */
import {
  getJWTCredentialsFactory,
  resubscribeCalendarsHandlerFactory,
  subscribeToEventChangesFactory,
  unsubscribeFromEventChangesFactory,
} from '@asap-hub/server-common';
import {
  asapApiUrl,
  googleApiCredentialsSecretId,
  googleApiToken,
  googleApiUrl,
  region,
} from '../../config';
import { getCalendarDataProvider } from '../../dependencies/calendar.dependency';
import logger from '../../utils/logger';
import { sentryWrapper } from '../../utils/sentry-wrapper';

const getJWTCredentials = getJWTCredentialsFactory({
  googleApiCredentialsSecretId,
  region,
});
export const handler = sentryWrapper(
  resubscribeCalendarsHandlerFactory(
    getCalendarDataProvider(),
    unsubscribeFromEventChangesFactory(getJWTCredentials, logger, {
      googleApiUrl,
    }),
    subscribeToEventChangesFactory(getJWTCredentials, logger, {
      asapApiUrl,
      googleApiToken,
      googleApiUrl,
    }),
    logger,
  ),
);
