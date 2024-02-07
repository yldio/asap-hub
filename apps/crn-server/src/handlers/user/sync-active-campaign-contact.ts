/* istanbul ignore file */
import { UserResponse } from '@asap-hub/model';
import type { ContactPayload, FieldIdByTitle } from '@asap-hub/server-common';
import {
  addContactToList,
  createContact,
  getContactFieldValues,
  getContactIdByEmail,
  getCustomFieldIdByTitle,
  getCustomFields,
  getListIdByName,
  syncActiveCampaignContactFactory,
  updateContact,
} from '@asap-hub/server-common';
import { activeCampaignAccount, activeCampaignToken } from '../../config';
import UserController from '../../controllers/user.controller';
import {
  getUserDataProvider,
  getAssetDataProvider,
  getResearchTagsDataProvider,
} from '../../dependencies/users.dependencies';
import logger from '../../utils/logger';
import { sentryWrapper } from '../../utils/sentry-wrapper';

const userDataProvider = getUserDataProvider();
const assetDataProvider = getAssetDataProvider();
const researchTagDataProvider = getResearchTagsDataProvider();

export const getContactPayload = (
  fieldIdByTitle: FieldIdByTitle,
  user: UserResponse,
): ContactPayload => {
  const teams = user.teams.length
    ? user.teams.flatMap((team, index) => [
        {
          field: fieldIdByTitle[`CRN Team ${index + 1}`]!, // eslint-disable-line @typescript-eslint/no-non-null-assertion
          value: team.displayName!, // eslint-disable-line @typescript-eslint/no-non-null-assertion
        },
        {
          field: fieldIdByTitle[`CRN Team Role ${index + 1}`]!, // eslint-disable-line @typescript-eslint/no-non-null-assertion
          value: team.role!, // eslint-disable-line @typescript-eslint/no-non-null-assertion
        },
        {
          field: fieldIdByTitle[`CRN Team Status ${index + 1}`]!, // eslint-disable-line @typescript-eslint/no-non-null-assertion
          value:
            team.inactiveSinceDate || team.teamInactiveSince
              ? 'Inactive'
              : 'Active',
        },
      ])
    : [];

  return {
    firstName: user.firstName!, // eslint-disable-line @typescript-eslint/no-non-null-assertion
    lastName: user.lastName!, // eslint-disable-line @typescript-eslint/no-non-null-assertion
    email: user.email!, // eslint-disable-line @typescript-eslint/no-non-null-assertion
    fieldValues: [
      ...teams,
      {
        field: fieldIdByTitle.Lab!, // eslint-disable-line @typescript-eslint/no-non-null-assertion
        value: user.labs.map((item) => item.name).join(', '),
      },
      {
        field: fieldIdByTitle.ORCID!, // eslint-disable-line @typescript-eslint/no-non-null-assertion
        value: user.orcid || '',
      },
      {
        field: fieldIdByTitle.Nickname!, // eslint-disable-line @typescript-eslint/no-non-null-assertion
        value: user.nickname || '',
      },
      {
        field: fieldIdByTitle.Middlename!, // eslint-disable-line @typescript-eslint/no-non-null-assertion
        value: user.middleName || '',
      },
      {
        field: fieldIdByTitle.Alumnistatus!, // eslint-disable-line @typescript-eslint/no-non-null-assertion
        value: user.alumniSinceDate ? 'Alumni' : 'Non Alumni',
      },
      {
        field: fieldIdByTitle.Country!, // eslint-disable-line @typescript-eslint/no-non-null-assertion
        value: user.country || '',
      },
      {
        field: fieldIdByTitle.Institution!, // eslint-disable-line @typescript-eslint/no-non-null-assertion
        value: user.institution || '',
      },
      {
        field: fieldIdByTitle['Working Group']!, // eslint-disable-line @typescript-eslint/no-non-null-assertion
        value: user.workingGroups.map((item) => item.name).join(', '),
      },
      {
        field: fieldIdByTitle['Interest Group']!, // eslint-disable-line @typescript-eslint/no-non-null-assertion
        value: user.interestGroups.map((item) => item.name).join(', '),
      },
      {
        field: fieldIdByTitle.LinkedIn!, // eslint-disable-line @typescript-eslint/no-non-null-assertion
        value: user.social?.linkedIn || '',
      },
      {
        field: fieldIdByTitle.Network!, // eslint-disable-line @typescript-eslint/no-non-null-assertion
        value: '||ASAP CRN||',
      },
    ],
  };
};

const updateContactLists = async (contactId: string) => {
  const listIdByName = await getListIdByName(
    activeCampaignAccount,
    activeCampaignToken,
  );

  const masterListId = listIdByName['Master List']!; // eslint-disable-line @typescript-eslint/no-non-null-assertion
  const CRNEmailListId = listIdByName['CRN HUB Email List']!; // eslint-disable-line @typescript-eslint/no-non-null-assertion

  for (const listId of [masterListId, CRNEmailListId]) {
    await await addContactToList(
      activeCampaignAccount,
      activeCampaignToken,
      contactId,
      listId,
    );
  }
};
const getFieldIdByTitle = async () => {
  const customFields = await getCustomFields(
    activeCampaignAccount,
    activeCampaignToken,
  );

  return getCustomFieldIdByTitle(customFields);
};

export const handler = sentryWrapper(
  syncActiveCampaignContactFactory(
    'CRN',
    new UserController(
      userDataProvider,
      assetDataProvider,
      researchTagDataProvider,
    ),
    logger,
    getContactIdByEmail,
    createContact,
    updateContact,
    updateContactLists,
    activeCampaignAccount,
    activeCampaignToken,
    getContactPayload,
    getFieldIdByTitle,
    getContactFieldValues,
  ),
);
