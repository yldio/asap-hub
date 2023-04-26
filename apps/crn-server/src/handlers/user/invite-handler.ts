/* istanbul ignore file */
import { inviteHandlerFactory } from '@asap-hub/server-common';
import { SES } from '@aws-sdk/client-ses';
import { origin, sesRegion } from '../../config';
import logger from '../../utils/logger';
import { sendEmailFactory } from '../../utils/send-email';
import { sentryWrapper } from '../../utils/sentry-wrapper';
import { UserDataProvider } from '../../data-providers/types';
import { getUserDataProvider } from '../../dependencies/users.dependencies';

const ses = new SES({
  apiVersion: '2010-12-01',
  region: sesRegion,
});

const userDataProvider = getUserDataProvider();

export const handler = sentryWrapper(
  inviteHandlerFactory<UserDataProvider>(
    sendEmailFactory(ses),
    userDataProvider,
    origin,
    logger,
  ),
);
