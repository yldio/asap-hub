/* istanbul ignore file */
import {
  AlertsSentry,
  calendarCreatedContentfulHandlerFactory,
  calendarCreatedSquidexHandlerFactory,
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
  isContentfulEnabled,
  region,
} from '../../config';
import { getCalendarDataProvider } from '../../dependencies/calendar.dependency';
import logger from '../../utils/logger';
import { sentryWrapper } from '../../utils/sentry-wrapper';

const getJWTCredentialsAWS = getJWTCredentialsFactory({
  googleApiCredentialsSecretId,
  region,
});

/* istanbul ignore next */
const webhookHandler = isContentfulEnabled
  ? calendarCreatedContentfulHandlerFactory(
      subscribeToEventChangesFactory(getJWTCredentialsAWS, logger, {
        asapApiUrl,
        googleApiToken,
        googleApiUrl,
        cms: 'contentful',
      }),
      unsubscribeFromEventChangesFactory(getJWTCredentialsAWS, logger, {
        googleApiUrl,
      }),
      getCalendarDataProvider(),
      new AlertsSentry(Sentry.captureException.bind(Sentry)),
      logger,
      {
        environment: contentfulEnvId,
        space: contentfulSpaceId,
        accessToken: contentfulAccessToken,
      },
    )
  : calendarCreatedSquidexHandlerFactory(
      subscribeToEventChangesFactory(getJWTCredentialsAWS, logger, {
        asapApiUrl,
        googleApiToken,
        googleApiUrl,
        cms: 'squidex',
      }),
      unsubscribeFromEventChangesFactory(getJWTCredentialsAWS, logger, {
        googleApiUrl,
      }),
      getCalendarDataProvider(),
      new AlertsSentry(Sentry.captureException.bind(Sentry)),
      logger,
    );

export const handler = sentryWrapper(webhookHandler);
