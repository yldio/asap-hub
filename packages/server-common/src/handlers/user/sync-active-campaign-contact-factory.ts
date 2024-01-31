import { NotFoundError } from '@asap-hub/errors';
import {
  UserEvent,
  gp2,
  UserResponse,
  UserUpdateRequest,
} from '@asap-hub/model';
import { isBoom } from '@hapi/boom';
import { EventBridgeEvent } from 'aws-lambda';

import { UserPayload } from '../event-bus';
import {
  EventBridgeHandler,
  Logger,
  ContactPayload,
  ContactResponse,
} from '../../utils';

export interface UserController {
  fetchById(id: string): Promise<gp2.UserResponse | UserResponse>;
  update(
    id: string,
    update: UserUpdateRequest | gp2.UserUpdateRequest,
  ): Promise<gp2.UserResponse | UserResponse>;
}

export const syncActiveCampaignContactFactory =
  (
    userController: UserController,
    log: Logger,
    getContactIdByEmail: (
      account: string,
      token: string,
      email: string,
    ) => Promise<string | null>,
    createContact: (
      account: string,
      token: string,
      contact: ContactPayload,
    ) => Promise<ContactResponse>,
    updateContact: (
      account: string,
      token: string,
      id: string,
      contact: ContactPayload,
    ) => Promise<ContactResponse>,
    activeCampaignAccount: string,
    activeCampaignToken: string,
    getContactPayload:
      | ((user: gp2.UserResponse) => Promise<ContactPayload>)
      | ((user: UserResponse) => Promise<ContactPayload>),
  ): EventBridgeHandler<UserEvent, UserPayload> =>
  async (event) => {
    log.info(`Event ${event['detail-type']}`);

    /* istanbul ignore next */
    if (activeCampaignToken === '') {
      log.info('Active Campaign Token not defined, skipping...');
      return;
    }

    try {
      const user = await userController.fetchById(event.detail.resourceId);
      log.info(`Fetched user ${user.id}`);

      if (user.onboarded) {
        const contactId = await getContactIdByEmail(
          activeCampaignAccount,
          activeCampaignToken,
          user.email,
        );

        let contactPayload: ContactPayload;

        if ('teams' in user) {
          contactPayload = await (
            getContactPayload as (user: UserResponse) => Promise<ContactPayload>
          )(user);
        } else {
          contactPayload = await (
            getContactPayload as (
              user: gp2.UserResponse,
            ) => Promise<ContactPayload>
          )(user);
        }

        if (!contactId) {
          const contactResponse = await createContact(
            activeCampaignAccount,
            activeCampaignToken,
            contactPayload,
          );

          if (contactResponse?.contact.cdate && contactResponse?.contact.id) {
            await userController.update(user.id, {
              activeCampaignCreatedAt: new Date(contactResponse.contact.cdate),
              activeCampaignId: contactResponse.contact.id,
            });
          }

          log.info(`Contact ${user.id} created`);
          return;
        }

        await updateContact(
          activeCampaignAccount,
          activeCampaignToken,
          contactId,
          contactPayload,
        );

        if (!user.activeCampaignId) {
          await userController.update(user.id, {
            activeCampaignId: contactId,
          });
        }

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
