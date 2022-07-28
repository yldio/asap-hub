import { inviteHandlerFactory } from '@asap-hub/server-common';
import { RestUser, SquidexRest } from '@asap-hub/squidex';
import * as Sentry from '@sentry/serverless';
import { SES } from 'aws-sdk';
import {
  appName,
  baseUrl,
  currentRevision,
  environment,
  origin,
  sentryDsn,
  sesRegion,
} from '../../config';
import { getAuthToken } from '../../utils/auth';
import logger from '../../utils/logger';
import { sendEmailFactory } from '../../utils/send-email';

const ses = new SES({
  apiVersion: '2010-12-01',
  region: sesRegion,
});

Sentry.AWSLambda.init({
  dsn: sentryDsn,
  tracesSampleRate: 1.0,
  environment,
  release: currentRevision,
});

const userRestClient = new SquidexRest<RestUser>(getAuthToken, 'users', {
  appName,
  baseUrl,
});

export const handler = Sentry.AWSLambda.wrapHandler(
  inviteHandlerFactory(
    sendEmailFactory(ses),
    userRestClient,
    origin,
    logger,
    'Gp2-Welcome',
  ),
);
