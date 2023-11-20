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
  region,
} from '../../config';
import { getCalendarDataProvider } from '../../dependencies/calendar.dependency';
import { getContentfulGraphQLClientFactory } from '../../dependencies/clients.dependency';
import logger from '../../utils/logger';
import { sentryWrapper } from '../../utils/sentry-wrapper';

const getJWTCredentials = getJWTCredentialsFactory({
  googleApiCredentialsSecretId,
  region,
});
const contentfulGraphQLClient = getContentfulGraphQLClientFactory();
export const handler = sentryWrapper(
  resubscribeCalendarsHandlerFactory(
    getCalendarDataProvider(contentfulGraphQLClient),
    unsubscribeFromEventChangesFactory(getJWTCredentials, logger),
    subscribeToEventChangesFactory(getJWTCredentials, logger, {
      asapApiUrl,
      googleApiToken,
    }),
    logger,
  ),
);
