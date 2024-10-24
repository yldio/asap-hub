/* istanbul ignore file */
import { Handler } from 'aws-lambda';

import {
  getJWTCredentialsFactory,
  syncCalendarFactory,
  syncEventFactory,
  webhookEventUpdatedProcessHandlerFactory,
} from '@asap-hub/server-common';
import { googleApiCredentialsSecretId, region } from '../../config';
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

const graphQLClient = getContentfulGraphQLClientFactory();

const eventController = new Events(getEventDataProvider(graphQLClient));
const syncCalendar = syncCalendarFactory(
  syncEventFactory(eventController, logger),
  getJWTCredentials,
  logger,
);

export const handler: Handler = sentryWrapper(
  webhookEventUpdatedProcessHandlerFactory(
    getCalendarDataProvider(graphQLClient),
    syncCalendar,
    logger,
  ),
);
