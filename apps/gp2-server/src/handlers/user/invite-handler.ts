import {
  gp2WelcomeTemplate,
  inviteHandlerFactory,
  sqsInviteHandlerFactory,
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

const eventHandler = inviteHandlerFactory<UserDataProvider>(
  sendEmailFactory(ses),
  userDataProvider,
  origin,
  logger,
  false,
  gp2WelcomeTemplate,
);

export const sqsHandler = sentryWrapper(
  sqsInviteHandlerFactory<UserDataProvider>(
    sendEmailFactory(ses),
    userDataProvider,
    origin,
    logger,
    false,
    gp2WelcomeTemplate,
  ),
);

export const handler = sentryWrapper(eventHandler);
