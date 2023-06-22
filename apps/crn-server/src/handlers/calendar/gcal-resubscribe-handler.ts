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
  isContentfulEnabledV2,
} from '../../config';
import { getCalendarDataProvider } from '../../dependencies/calendars.dependencies';
import logger from '../../utils/logger';
import { sentryWrapper } from '../../utils/sentry-wrapper';
import { getCalendarSubscriptionId } from '../../utils/get-calendar-subscription-id';

/* istanbul ignore next */
const getJWTCredentials = getJWTCredentialsFactory({
  googleApiCredentialsSecretId,
  region,
});

/* istanbul ignore next */
const getCalendarId = (id: string): string =>
  isContentfulEnabledV2 ? getCalendarSubscriptionId(id) : id;

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
    getCalendarId,
  ),
);
