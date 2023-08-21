import { EventBridgeEvent } from 'aws-lambda';
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
    _template: SendEmailTemplate = 'Crn-Welcome',
  ): EventBridgeHandler<'UsersPublished', UserPayload> =>
  async (event) => {
    logger.info(`Received event for user with ID ${event.detail.resourceId}`);
    logger.info(event.detail);
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

    logger.info(`Invited user with ID ${user.id}`);
  };

export type UserInviteEventBridgeEvent = EventBridgeEvent<
  'UsersPublished',
  UserPayload
>;
