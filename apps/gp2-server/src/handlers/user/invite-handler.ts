import {
  gp2WelcomeTemplate,
  inviteHandlerFactory,
} from '@asap-hub/server-common';
import { gp2 as gp2Squidex, SquidexRest } from '@asap-hub/squidex';
import { SES } from 'aws-sdk';
import { appName, baseUrl, origin, sesRegion } from '../../config';
import { getAuthToken } from '../../utils/auth';
import logger from '../../utils/logger';
import { sendEmailFactory } from '../../utils/send-email';
import { sentryWrapper } from '../../utils/sentry-wrapper';

const ses = new SES({
  apiVersion: '2010-12-01',
  region: sesRegion,
});

/* istanbul ignore next */
const restClient = new SquidexRest<gp2Squidex.RestUser>(getAuthToken, 'users', {
  appName,
  baseUrl,
});

/* istanbul ignore next */
export const handler = sentryWrapper(
  inviteHandlerFactory(
    sendEmailFactory(ses),
    restClient,
    origin,
    logger,
    gp2WelcomeTemplate,
  ),
);
