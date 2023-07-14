/* istanbul ignore file */
import {
  gp2WelcomeTemplate,
  inviteHandlerFactory,
} from '@asap-hub/server-common';
import { SES } from '@aws-sdk/client-ses';
import { origin, sesRegion } from '../../config';
import { UserDataProvider } from '../../data-providers/types';
import { getContentfulGraphQLClientFactory } from '../../dependencies/clients.dependency';
import { getUserDataProvider } from '../../dependencies/user.dependency';
import logger from '../../utils/logger';
import { sendEmailFactory } from '../../utils/send-email';
import { sentryWrapper } from '../../utils/sentry-wrapper';

const ses = new SES({
  apiVersion: '2010-12-01',
  region: sesRegion,
});

const contentfulGraphQLClient = getContentfulGraphQLClientFactory();
const userDataProvider = getUserDataProvider(contentfulGraphQLClient);

export const handler = sentryWrapper(
  inviteHandlerFactory<UserDataProvider>(
    sendEmailFactory(ses),
    userDataProvider,
    origin,
    logger,
    gp2WelcomeTemplate,
  ),
);
