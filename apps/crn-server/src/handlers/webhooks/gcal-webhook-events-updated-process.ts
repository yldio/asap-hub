import {
  getJWTCredentialsFactory,
  syncCalendarFactory,
  syncEventFactory,
  webhookEventUpdatedProcessHandlerFactory,
} from '@asap-hub/server-common';
import { Handler } from 'aws-lambda';
import { googleApiCredentialsSecretId, region } from '../../config';
import Events from '../../controllers/event.controller';
import { getCalendarDataProvider } from '../../dependencies/calendars.dependencies';
import { getEventDataProvider } from '../../dependencies/events.dependencies';
import logger from '../../utils/logger';
import { sentryWrapper } from '../../utils/sentry-wrapper';

const getJWTCredentials = getJWTCredentialsFactory({
  googleApiCredentialsSecretId,
  region,
});

const syncCalendar = syncCalendarFactory(
  syncEventFactory(new Events(getEventDataProvider()), logger),
  getJWTCredentials,
  logger,
);

export const handler: Handler = sentryWrapper(
  webhookEventUpdatedProcessHandlerFactory(
    getCalendarDataProvider(),
    syncCalendar,
    logger,
  ),
);
