import {
  getJWTCredentialsFactory,
  unsubscribeCalendarsHandlerFactory,
  unsubscribeFromEventChangesFactory,
} from '@asap-hub/server-common';
import { googleApiCredentialsSecretId, region } from '../../config';
import { getCalendarDataProvider } from '../../dependencies/calendars.dependencies';
import { getCalendarSubscriptionId } from '../../utils/get-calendar-subscription-id';
import logger from '../../utils/logger';
import { sentryWrapper } from '../../utils/sentry-wrapper';

/* istanbul ignore next */
const getJWTCredentials = getJWTCredentialsFactory({
  googleApiCredentialsSecretId,
  region,
});

export const handler = sentryWrapper(
  unsubscribeCalendarsHandlerFactory(
    getCalendarDataProvider(),
    unsubscribeFromEventChangesFactory(getJWTCredentials, logger),
    logger,
    getCalendarSubscriptionId,
  ),
);
