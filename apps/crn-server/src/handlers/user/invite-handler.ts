import { RestUser, SquidexRest, SquidexRestClient } from '@asap-hub/squidex';
import { getAccessTokenFactory } from '@asap-hub/squidex/src/auth';
import * as Sentry from '@sentry/serverless';
import { EventBridgeEvent } from 'aws-lambda';
import { SES } from 'aws-sdk';
import path from 'path';
import url from 'url';
import { v4 as uuidV4 } from 'uuid';
import {
  appName,
  baseUrl,
  clientId,
  clientSecret,
  currentRevision,
  environment,
  origin,
  sentryDsn,
  sesRegion,
} from '../../config';
import logger from '../../utils/logger';
import { SendEmail, sendEmailFactory } from '../../utils/send-email';
import { EventBridgeHandler } from '../../utils/types';
import { UserPayload } from '../event-bus';

export const inviteHandlerFactory =
  (
    sendEmail: SendEmail,
    userClient: SquidexRestClient<RestUser>,
  ): EventBridgeHandler<'UsersPublished', UserPayload> =>
  async (event) => {
    let user: RestUser;

    try {
      user = await userClient.fetchById(event.detail.payload.id);
    } catch (error) {
      logger.error(error, 'Error while fetching user');
      throw new Error(
        `Unable to find a user with ID ${event.detail.payload.id}`,
      );
    }

    logger.debug(
      `Attempting to invite user with ID ${event.detail.payload.id}, e-mail address ${user.data.email}`,
    );

    const previousCode = user.data.connections.iv
      ?.map((c) => c.code)
      .find((c) => c.match(uuidMatch));

    if (previousCode) {
      logger.info(
        `Found a previous invitation code for user ${user.id}, exiting...`,
      );
      return;
    }
    const newCode = uuidV4();

    try {
      await userClient.patch(user.id, {
        connections: {
          iv: [{ code: newCode }],
        },
      });
    } catch (error) {
      logger.error(error, 'Error while saving user data');
      throw new Error(
        `Unable to save the code for the user with ID ${event.detail.payload.id}`,
      );
    }

    const link = new url.URL(path.join(`/welcome/${newCode}`), origin);

    try {
      await sendEmail({
        to: [user.data.email.iv],
        template: 'Welcome',
        values: {
          firstName: user.data.firstName.iv,
          link: link.toString(),
        },
      });
    } catch (error) {
      logger.error(error, 'Error while sending email');
      throw new Error(
        `Unable to send the email for the user with ID ${event.detail.payload.id}`,
      );
    }

    logger.info(`Invited user with ID ${user.id}`);
  };

const ses = new SES({
  apiVersion: '2010-12-01',
  region: sesRegion,
});

const uuidMatch =
  /^([\d\w]{8})-?([\d\w]{4})-?([\d\w]{4})-?([\d\w]{4})-?([\d\w]{12})|[{0x]*([\d\w]{8})[0x, ]{4}([\d\w]{4})[0x, ]{4}([\d\w]{4})[0x, {]{5}([\d\w]{2})[0x, ]{4}([\d\w]{2})[0x, ]{4}([\d\w]{2})[0x, ]{4}([\d\w]{2})[0x, ]{4}([\d\w]{2})[0x, ]{4}([\d\w]{2})[0x, ]{4}([\d\w]{2})[0x, ]{4}([\d\w]{2})$/;

Sentry.AWSLambda.init({
  dsn: sentryDsn,
  tracesSampleRate: 1.0,
  environment,
  release: currentRevision,
});

const getAuthToken = getAccessTokenFactory({ clientId, clientSecret, baseUrl });
const userRestClient = new SquidexRest<RestUser>(getAuthToken, 'users', {
  appName,
  baseUrl,
});

export const handler = Sentry.AWSLambda.wrapHandler(
  inviteHandlerFactory(sendEmailFactory(ses), userRestClient),
);

export type UserInviteEventBridgeEvent = EventBridgeEvent<
  'UsersPublished',
  UserPayload
>;
