import { NotFoundError } from '@asap-hub/errors';
import {
  UserEvent,
  gp2,
  UserResponse,
  UserUpdateRequest,
} from '@asap-hub/model';
import { isBoom } from '@hapi/boom';
import { EventBridgeEvent } from 'aws-lambda';

import type { UserPayload } from '../event-bus';
import type {
  EventBridgeHandler,
  Logger,
  ContactPayload,
  ContactResponse,
  FieldIdByTitle,
  FieldValuesResponse,
} from '../../utils';

type GetContactPayloadCRN = (
  fieldIdByTitle: FieldIdByTitle,
  user: UserResponse,
) => ContactPayload;

type GetContactPayloadGP2 = (
  fieldIdByTitle: FieldIdByTitle,
  user: gp2.UserResponse,
) => ContactPayload;

export interface UserController {
  fetchById(id: string): Promise<gp2.UserResponse | UserResponse>;
  update(
    id: string,
    update: UserUpdateRequest | gp2.UserUpdateRequest,
  ): Promise<gp2.UserResponse | UserResponse>;
}

export const syncActiveCampaignContactFactory =
  (
    app: 'CRN' | 'GP2',
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
    updateContactLists: (contactId: string) => Promise<void>,
    activeCampaignAccount: string,
    activeCampaignToken: string,
    getContactPayload: GetContactPayloadCRN | GetContactPayloadGP2,
    getFieldIdByTitle: () => Promise<FieldIdByTitle>,
    getContactFieldValues: (
      account: string,
      token: string,
      contactId: string,
    ) => Promise<FieldValuesResponse>,
  ): EventBridgeHandler<UserEvent, UserPayload> =>
  async (event) => {
    log.info(`Event ${event['detail-type']}`);

    /* istanbul ignore next */
    if (activeCampaignToken === '') {
      log.info('Active Campaign Token not defined, skipping...');
      return;
    }

    const userId = event.detail.resourceId;

    try {
      await syncUserActiveCampaignData(
        app,
        userController,
        userId,
        log,
        getContactIdByEmail,
        createContact,
        updateContact,
        updateContactLists,
        activeCampaignAccount,
        activeCampaignToken,
        getContactPayload,
        getFieldIdByTitle,
        getContactFieldValues,
      );
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

export const syncUserActiveCampaignData = async (
  app: 'CRN' | 'GP2',
  userController: UserController,
  userId: string,
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
  updateContactLists: (contactId: string) => Promise<void>,
  activeCampaignAccount: string,
  activeCampaignToken: string,
  getContactPayload: GetContactPayloadCRN | GetContactPayloadGP2,
  getFieldIdByTitle: () => Promise<FieldIdByTitle>,
  getContactFieldValues: (
    account: string,
    token: string,
    contactId: string,
  ) => Promise<FieldValuesResponse>,
) => {
  const user = await userController.fetchById(userId);
  log.info(`Fetched user ${user.id}`);

  if (user.onboarded) {
    const contactId = await getContactIdByEmail(
      activeCampaignAccount,
      activeCampaignToken,
      user.email,
    );

    const fieldIdByTitle = await getFieldIdByTitle();

    let contactPayload: ContactPayload;

    if ('teams' in user) {
      contactPayload = (getContactPayload as GetContactPayloadCRN)(
        fieldIdByTitle,
        user,
      );
    } else {
      contactPayload = (getContactPayload as GetContactPayloadGP2)(
        fieldIdByTitle,
        user,
      );
    }

    if (!contactId) {
      const contactResponse = await createContact(
        activeCampaignAccount,
        activeCampaignToken,
        contactPayload,
      );

      if (contactResponse?.contact.cdate && contactResponse?.contact.id) {
        await updateContactLists(contactResponse.contact.id);

        await userController.update(user.id, {
          activeCampaignCreatedAt: new Date(contactResponse.contact.cdate),
          activeCampaignId: contactResponse.contact.id,
        });
      }

      log.info(`Contact ${user.id} created`);
      return;
    }

    const contactFieldValues = await getContactFieldValues(
      activeCampaignAccount,
      activeCampaignToken,
      contactId,
    );

    const networkFieldValue = contactFieldValues.fieldValues.find(
      (fieldValues) => fieldValues.field === fieldIdByTitle.Network!, // eslint-disable-line @typescript-eslint/no-non-null-assertion
    );

    if (networkFieldValue?.value) {
      const getNetworkValue = (previousNetworkValue: string) => {
        const hasGP2 = previousNetworkValue.includes('GP2');
        const hasCRN = previousNetworkValue.includes('CRN');

        if (app === 'CRN') {
          return hasGP2 ? '||GP2||ASAP CRN||' : 'ASAP CRN';
        }

        return hasCRN ? '||GP2||ASAP CRN||' : 'GP2';
      };

      contactPayload = {
        ...contactPayload,
        fieldValues: [
          ...contactPayload.fieldValues.filter(
            (fieldValue) => fieldValue.field !== networkFieldValue.field,
          ),
          {
            field: networkFieldValue.field,
            value: getNetworkValue(networkFieldValue?.value),
          },
        ],
      };
    }

    await updateContact(
      activeCampaignAccount,
      activeCampaignToken,
      contactId,
      contactPayload,
    );

    await updateContactLists(contactId);

    if (!user.activeCampaignId) {
      await userController.update(user.id, {
        activeCampaignId: contactId,
      });
    }

    log.info(
      `Contact with cms id ${user.id} and active campaign id ${contactId} updated`,
    );
  }
};

export type UserEventBridgeEvent = EventBridgeEvent<
  'UsersPublished',
  UserPayload
>;
