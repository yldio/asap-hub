/* istanbul ignore file */
import {
  getJWTCredentialsFactory,
  syncCalendarFactory,
  syncEventFactory,
  webhookEventUpdatedHandlerFactory,
} from '@asap-hub/server-common';
import { Handler } from 'aws-lambda';
import {
  googleApiCredentialsSecretId,
  googleApiToken,
  region,
} from '../../config';
import Events from '../../controllers/event.controller';
import { getCalendarDataProvider } from '../../dependencies/calendar.dependency';
import { getContentfulGraphQLClientFactory } from '../../dependencies/clients.dependency';
import { getEventDataProvider } from '../../dependencies/event.dependency';
import logger from '../../utils/logger';
import { sentryWrapper } from '../../utils/sentry-wrapper';

const getJWTCredentials = getJWTCredentialsFactory({
  googleApiCredentialsSecretId,
  region,
});

const contentfulGraphQLClient = getContentfulGraphQLClientFactory();
const eventController = new Events(
  getEventDataProvider(contentfulGraphQLClient),
);
const syncCalendar = syncCalendarFactory(
  syncEventFactory(eventController, logger),
  getJWTCredentials,
  logger,
);

export const handler: Handler = sentryWrapper(
  webhookEventUpdatedHandlerFactory(
    getCalendarDataProvider(contentfulGraphQLClient),
    syncCalendar,
    logger,
    { googleApiToken },
  ),
);
