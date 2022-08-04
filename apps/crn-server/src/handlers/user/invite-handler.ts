import { inviteHandlerFactory } from '@asap-hub/server-common';
import { RestUser, SquidexRest } from '@asap-hub/squidex';
import { SES } from 'aws-sdk';
import {
  appName,
  baseUrl,
  origin,
  sesRegion,
} from '../../config';
import { getAuthToken } from '../../utils/auth';
import logger from '../../utils/logger';
import { sendEmailFactory } from '../../utils/send-email';
import { sentryWrapper } from "../../utils/sentry-wrapper";

const ses = new SES({
  apiVersion: '2010-12-01',
  region: sesRegion,
});

const userRestClient = new SquidexRest<RestUser>(getAuthToken, 'users', {
  appName,
  baseUrl,
});

export const handler = sentryWrapper(
  inviteHandlerFactory(sendEmailFactory(ses), userRestClient, origin, logger),
);
