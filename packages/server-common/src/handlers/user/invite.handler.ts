import { EventBridgeEvent } from 'aws-lambda';
import path from 'path';
import url from 'url';
import { v4 as uuidV4 } from 'uuid';
import { gp2, UserDataObject, UserUpdateDataObject } from '@asap-hub/model';
import {
  EventBridgeHandler,
  Logger,
  SendEmail,
  SendEmailTemplate,
} from '../../utils';
import { UserPayload } from '../event-bus';

interface DataProvider {
  fetchById(id: string): Promise<gp2.UserDataObject | UserDataObject | null>;
  update(
    id: string,
    user: gp2.UserUpdateDataObject | UserUpdateDataObject,
  ): Promise<void>;
}

export const inviteHandlerFactory =
  <Provider extends DataProvider>(
    sendEmail: SendEmail,
    dataProvider: Provider,
    origin: string,
    logger: Logger,
    template: SendEmailTemplate = 'Crn-Welcome',
  ): EventBridgeHandler<'UsersPublished', UserPayload> =>
  async (event) => {
    const user = await dataProvider.fetchById(event.detail.resourceId);
    if (!user) {
      throw new Error(
        `Unable to find a user with ID ${event.detail.resourceId}`,
      );
    }

    if (user.connections?.length) {
      logger.info(
        `Found an existing connection code for user ${user.id}, exiting...`,
      );
      return;
    }

    logger.debug(
      `Attempting to invite user with ID ${event.detail.resourceId}, e-mail address ${user.email}`,
    );

    const code = uuidV4();

    try {
      await dataProvider.update(user.id, {
        connections: [{ code }],
      });
    } catch (error) {
      logger.error(error, 'Error while saving user data');
      throw new Error(
        `Unable to save the code for the user with ID ${event.detail.resourceId}`,
      );
    }

    const link = new url.URL(path.join(`/welcome/${code}`), origin);

    try {
      await sendEmail({
        to: [user.email],
        template,
        values: {
          firstName: user.firstName,
          link: link.toString(),
        },
      });
    } catch (error) {
      logger.error(error, 'Error while sending email');
      throw new Error(
        `Unable to send the email for the user with ID ${event.detail.resourceId}`,
      );
    }

    logger.info(`Invited user with ID ${user.id}`);
  };

export type UserInviteEventBridgeEvent = EventBridgeEvent<
  'UsersPublished',
  UserPayload
>;
