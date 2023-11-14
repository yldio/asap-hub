/* istanbul ignore file */
import {
  AlertsSentry,
  calendarCreatedContentfulHandlerFactory,
  getJWTCredentialsFactory,
  subscribeToEventChangesFactory,
  unsubscribeFromEventChangesFactory,
} from '@asap-hub/server-common';
import * as Sentry from '@sentry/serverless';
import 'source-map-support/register';
import {
  asapApiUrl,
  contentfulAccessToken,
  contentfulEnvId,
  contentfulSpaceId,
  googleApiCredentialsSecretId,
  googleApiToken,
  region,
} from '../../config';
import { getCalendarDataProvider } from '../../dependencies/calendar.dependency';
import { getContentfulGraphQLClientFactory } from '../../dependencies/clients.dependency';
import logger from '../../utils/logger';
import { sentryWrapper } from '../../utils/sentry-wrapper';

const getJWTCredentialsAWS = getJWTCredentialsFactory({
  googleApiCredentialsSecretId,
  region,
});

const contentfulGraphQLClient = getContentfulGraphQLClientFactory();
/* istanbul ignore next */
const webhookHandler = calendarCreatedContentfulHandlerFactory(
  subscribeToEventChangesFactory(getJWTCredentialsAWS, logger, {
    asapApiUrl,
    googleApiToken,
  }),
  unsubscribeFromEventChangesFactory(getJWTCredentialsAWS, logger),
  getCalendarDataProvider(contentfulGraphQLClient),
  new AlertsSentry(Sentry.captureException.bind(Sentry)),
  logger,
  {
    environment: contentfulEnvId,
    space: contentfulSpaceId,
    accessToken: contentfulAccessToken,
  },
);

export const handler = sentryWrapper(webhookHandler);
