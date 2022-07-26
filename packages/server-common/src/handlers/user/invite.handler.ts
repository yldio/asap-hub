import { RestUser, SquidexRestClient } from '@asap-hub/squidex';
import { EventBridgeEvent } from 'aws-lambda';
import path from 'path';
import url from 'url';
import { v4 as uuidV4 } from 'uuid';
import {
  EventBridgeHandler,
  Logger,
  SendEmail,
  SendEmailTemplate,
} from '../../utils';
import { UserPayload } from '../event-bus';

const uuidMatch =
  /^([\d\w]{8})-?([\d\w]{4})-?([\d\w]{4})-?([\d\w]{4})-?([\d\w]{12})|[{0x]*([\d\w]{8})[0x, ]{4}([\d\w]{4})[0x, ]{4}([\d\w]{4})[0x, {]{5}([\d\w]{2})[0x, ]{4}([\d\w]{2})[0x, ]{4}([\d\w]{2})[0x, ]{4}([\d\w]{2})[0x, ]{4}([\d\w]{2})[0x, ]{4}([\d\w]{2})[0x, ]{4}([\d\w]{2})[0x, ]{4}([\d\w]{2})$/;

export const inviteHandlerFactory =
  (
    sendEmail: SendEmail,
    userClient: SquidexRestClient<RestUser>,
    origin: string,
    logger: Logger,
    template: SendEmailTemplate = 'Welcome',
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
        template,
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

export type UserInviteEventBridgeEvent = EventBridgeEvent<
  'UsersPublished',
  UserPayload
>;
