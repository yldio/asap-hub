/* istanbul ignore file */
import {
  getJWTCredentialsFactory,
  unsubscribeCalendarsHandlerFactory,
  unsubscribeFromEventChangesFactory,
} from '@asap-hub/server-common';
import { googleApiCredentialsSecretId, region } from '../../config';
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
  unsubscribeCalendarsHandlerFactory(
    getCalendarDataProvider(contentfulGraphQLClient),
    unsubscribeFromEventChangesFactory(getJWTCredentials, logger),
    logger,
  ),
);
