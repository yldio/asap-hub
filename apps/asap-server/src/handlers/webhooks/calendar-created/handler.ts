import * as Sentry from '@sentry/serverless';
import { sentryDsn, environment, currentRevision } from '../../../config';
import Calendars from '../../../controllers/calendars';
import getJWTCredentials from '../../../utils/aws-secret-manager';
import { Handler } from '../../../utils/types';
import {
  subscribeToEventChangesFactory,
  unsubscribeFromEventChangesFactory,
  calendarCreatedHandlerFactory,
} from './calendar-created';

Sentry.AWSLambda.init({
  dsn: sentryDsn,
  tracesSampleRate: 1.0,
  environment,
  release: currentRevision,
});

const webhookHandler: Handler = calendarCreatedHandlerFactory(
  subscribeToEventChangesFactory(getJWTCredentials),
  unsubscribeFromEventChangesFactory(getJWTCredentials),
  new Calendars(),
);

export const handler = Sentry.AWSLambda.wrapHandler(webhookHandler);
