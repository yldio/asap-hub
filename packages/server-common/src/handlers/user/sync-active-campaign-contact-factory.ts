import { NotFoundError } from '@asap-hub/errors';
import { UserEvent, gp2, UserResponse } from '@asap-hub/model';
import { isBoom } from '@hapi/boom';
import { EventBridgeEvent } from 'aws-lambda';

import { UserPayload } from '../event-bus';
import { EventBridgeHandler, Logger, getContactIdByEmail } from '../../utils';

export interface UserController {
  fetchById(id: string): Promise<gp2.UserResponse | UserResponse>;
  createActiveCampaignContact(
    user: gp2.UserResponse | UserResponse,
  ): Promise<void>;
  updateActiveCampaignContact(
    contactId: string,
    user: gp2.UserResponse | UserResponse,
  ): Promise<void>;
}

export const syncActiveCampaignContactFactory =
  <Controller extends UserController>(
    userController: Controller,
    log: Logger,
    activeCampaignAccount: string,
    activeCampaignToken: string,
  ): EventBridgeHandler<UserEvent, UserPayload> =>
  async (event) => {
    log.info(`Event ${event['detail-type']}`);

    try {
      const user = await userController.fetchById(event.detail.resourceId);
      log.info(`Fetched user ${user.id}`);

      if (user.onboarded) {
        const contactId = await getContactIdByEmail(
          activeCampaignAccount,
          activeCampaignToken,
          user.email,
        );

        if (!contactId) {
          await userController.createActiveCampaignContact(user);
          log.info(`Contact ${user.id} created`);
          return;
        }

        await userController.updateActiveCampaignContact(contactId, user);
        log.info(
          `Contact with cms id ${user.id} and active campaign id ${contactId} updated`,
        );
      }
    } catch (e) {
      if (
        (isBoom(e) && e.output.statusCode === 404) ||
        e instanceof NotFoundError
      ) {
        log.info(e, 'User not found');
        return;
      }

      log.info(
        e,
        `Error creating/updating user ${event.detail.resourceId} to Active Campaign`,
      );
      throw e;
    }
  };

export type UserEventBridgeEvent = EventBridgeEvent<
  'UsersPublished',
  UserPayload
>;
