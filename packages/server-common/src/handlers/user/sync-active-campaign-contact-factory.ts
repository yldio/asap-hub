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
import {
  EventBridgeHandler,
  Logger,
  ContactPayload,
  GetContactPayloadCRN,
  GetContactPayloadGP2,
  GetContactPayload,
  ActiveCampaignType,
  CRNFieldIdByTitle,
  GP2FieldIdByTitle,
} from '../../utils';

export interface UserController {
  fetchById(id: string): Promise<gp2.UserResponse | UserResponse>;
  update(
    id: string,
    update: UserUpdateRequest | gp2.UserUpdateRequest,
    options?: { suppressConflict?: boolean; polling?: boolean } | null,
  ): Promise<gp2.UserResponse | UserResponse>;
}

export const syncUserActiveCampaignData = async (
  config: {
    app: 'CRN' | 'GP2';
    activeCampaignAccount: string;
    activeCampaignToken: string;
  },
  ActiveCampaign: ActiveCampaignType,
  userController: UserController,
  getContactPayload: GetContactPayload,
  listNames: string[],
  userId: string,
  log: Logger,
) => {
  const {
    addContactToList,
    createContact,
    getContactFieldValues,
    getContactIdByEmail,
    getCustomFieldIdByTitle,
    getListIdByName,
    unsubscribeContactFromLists,
    updateContact,
  } = ActiveCampaign;

  const { app, activeCampaignAccount, activeCampaignToken } = config;

  const updateContactLists = async (contactId: string, isAlumni: boolean) => {
    const listIdByName = await getListIdByName(
      activeCampaignAccount,
      activeCampaignToken,
    );

    if (isAlumni) {
      await unsubscribeContactFromLists(
        activeCampaignAccount,
        activeCampaignToken,
        contactId,
        listIdByName,
      );
      return;
    }

    const listIds: string[] = [];

    listNames.forEach((listName) => {
      if (
        listName in listIdByName &&
        listIdByName[listName] &&
        typeof listIdByName[listName] === 'string'
      ) {
        listIds.push(listIdByName[listName] as string);
      }
    });

    await Promise.all(
      listIds.map(async (listId) => {
        await addContactToList(
          activeCampaignAccount,
          activeCampaignToken,
          contactId,
          listId,
        );
      }),
    );
  };

  const user = await userController.fetchById(userId);

  log.info(`Fetched user ${user.id}`);

  const isAlumni =
    'alumniSinceDate' in user ? Boolean(user.alumniSinceDate) : false;

  if (user.onboarded) {
    const contactId = await getContactIdByEmail(
      activeCampaignAccount,
      activeCampaignToken,
      user.email,
    );

    const fieldIdByTitle = await getCustomFieldIdByTitle(
      activeCampaignAccount,
      activeCampaignToken,
    );

    let contactPayload: ContactPayload;

    if ('teams' in user) {
      contactPayload = (getContactPayload as GetContactPayloadCRN)(
        fieldIdByTitle as CRNFieldIdByTitle,
        user,
      );
    } else {
      contactPayload = (getContactPayload as GetContactPayloadGP2)(
        fieldIdByTitle as GP2FieldIdByTitle,
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
        await updateContactLists(contactResponse.contact.id, isAlumni);

        await userController.update(
          user.id,
          {
            activeCampaignCreatedAt: new Date(contactResponse.contact.cdate),
            activeCampaignId: contactResponse.contact.id,
          },
          { polling: false },
        );
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

    await updateContactLists(contactId, isAlumni);

    if (!user.activeCampaignId) {
      await userController.update(
        user.id,
        {
          activeCampaignId: contactId,
        },
        { polling: false },
      );
    }

    log.info(
      `Contact with cms id ${user.id} and active campaign id ${contactId} updated`,
    );
  }
};

export const syncActiveCampaignContactFactory =
  (
    config: {
      app: 'CRN' | 'GP2';
      activeCampaignAccount: string;
      activeCampaignToken: string;
    },
    ActiveCampaign: ActiveCampaignType,
    userController: UserController,
    getContactPayload: GetContactPayloadCRN | GetContactPayloadGP2,
    listNames: string[],
    log: Logger,
  ): EventBridgeHandler<UserEvent, UserPayload> =>
  async (event) => {
    log.info(`Event ${event['detail-type']}`);

    /* istanbul ignore next */
    if (config.activeCampaignToken === '') {
      log.info('Active Campaign Token not defined, skipping...');
      return;
    }

    const userId = event.detail.resourceId;

    try {
      await syncUserActiveCampaignData(
        config,
        ActiveCampaign,
        userController,
        getContactPayload,
        listNames,
        userId,
        log,
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

export type UserEventBridgeEvent = EventBridgeEvent<
  'UsersPublished',
  UserPayload
>;
