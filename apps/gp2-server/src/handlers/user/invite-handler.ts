/* istanbul ignore file */
import {
  gp2WelcomeTemplate,
  inviteHandlerFactory,
} from '@asap-hub/server-common';
import {
  gp2 as gp2Squidex,
  SquidexRest,
  SquidexGraphql,
} from '@asap-hub/squidex';
import { SES } from '@aws-sdk/client-ses';
import { appName, baseUrl, origin, sesRegion } from '../../config';
import { getAuthToken } from '../../utils/auth';
import logger from '../../utils/logger';
import { sendEmailFactory } from '../../utils/send-email';
import { sentryWrapper } from '../../utils/sentry-wrapper';
import {
  UserSquidexDataProvider,
  UserDataProvider,
} from '../../data-providers/user.data-provider';

const ses = new SES({
  apiVersion: '2010-12-01',
  region: sesRegion,
});

const squidexGraphqlClient = new SquidexGraphql(getAuthToken, {
  appName,
  baseUrl,
});

const restClient = new SquidexRest<gp2Squidex.RestUser>(getAuthToken, 'users', {
  appName,
  baseUrl,
});

const userDataProvider = new UserSquidexDataProvider(
  squidexGraphqlClient,
  restClient,
);

export const handler = sentryWrapper(
  inviteHandlerFactory<UserDataProvider>(
    sendEmailFactory(ses),
    userDataProvider,
    origin,
    logger,
    gp2WelcomeTemplate,
  ),
);
