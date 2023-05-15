import {
  AlertsSentry,
  calendarCreatedSquidexHandlerFactory,
  calendarCreatedContentfulHandlerFactory,
  getJWTCredentialsFactory,
  subscribeToEventChangesFactory,
  unsubscribeFromEventChangesFactory,
} from '@asap-hub/server-common';
import * as Sentry from '@sentry/serverless';
import 'source-map-support/register';
import {
  asapApiUrl,
  contentfulEnvId,
  contentfulSpaceId,
  contentfulAccessToken,
  googleApiCredentialsSecretId,
  googleApiToken,
  googleApiUrl,
  isContentfulEnabledV2,
  region,
} from '../../config';
import { getCalendarDataProvider } from '../../dependencies/calendars.dependencies';
import logger from '../../utils/logger';
import { sentryWrapper } from '../../utils/sentry-wrapper';

/* istanbul ignore next */
const getJWTCredentialsAWS = getJWTCredentialsFactory({
  googleApiCredentialsSecretId,
  region,
});

export const calendarCreatedHandlerFactory = isContentfulEnabledV2
  ? calendarCreatedContentfulHandlerFactory
  : calendarCreatedSquidexHandlerFactory;

export const contentfulDeliveryApiConfig = {
  environment: contentfulEnvId,
  space: contentfulSpaceId,
  accessToken: contentfulAccessToken,
};

export const cms = isContentfulEnabledV2 ? 'contentful' : 'squidex';

export const webhookHandler = calendarCreatedHandlerFactory(
  subscribeToEventChangesFactory(getJWTCredentialsAWS, logger, {
    asapApiUrl,
    googleApiToken,
    googleApiUrl,
    cms,
  }),
  unsubscribeFromEventChangesFactory(getJWTCredentialsAWS, logger, {
    googleApiUrl,
  }),
  getCalendarDataProvider(),
  new AlertsSentry(Sentry.captureException.bind(Sentry)),
  logger,
  contentfulDeliveryApiConfig,
);

export const handler = sentryWrapper(webhookHandler);
