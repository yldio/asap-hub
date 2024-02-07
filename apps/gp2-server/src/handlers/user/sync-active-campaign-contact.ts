/* istanbul ignore file */
import { gp2 as gp2Model } from '@asap-hub/model';
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
import { AssetContentfulDataProvider } from '../../data-providers/asset.data-provider';
import { UserContentfulDataProvider } from '../../data-providers/user.data-provider';
import {
  getContentfulGraphQLClientFactory,
  getContentfulRestClientFactory,
} from '../../dependencies/clients.dependency';
import logger from '../../utils/logger';
import { sentryWrapper } from '../../utils/sentry-wrapper';

const contentfulGraphQLClient = getContentfulGraphQLClientFactory();
const userDataProvider = new UserContentfulDataProvider(
  contentfulGraphQLClient,
  getContentfulRestClientFactory,
);
const assetDataProvider = new AssetContentfulDataProvider(
  getContentfulRestClientFactory,
);

export const getContactPayload = (
  fieldIdByTitle: FieldIdByTitle,
  user: gp2Model.UserResponse,
): ContactPayload => ({
  firstName: user.firstName!, // eslint-disable-line @typescript-eslint/no-non-null-assertion
  lastName: user.lastName!, // eslint-disable-line @typescript-eslint/no-non-null-assertion
  email: user.email!, // eslint-disable-line @typescript-eslint/no-non-null-assertion
  fieldValues: [
    {
      field: fieldIdByTitle.Nickname!, // eslint-disable-line @typescript-eslint/no-non-null-assertion
      value: user.nickname || '',
    },
    {
      field: fieldIdByTitle.Middlename!, // eslint-disable-line @typescript-eslint/no-non-null-assertion
      value: user.middleName || '',
    },
    {
      field: fieldIdByTitle.ORCID!, // eslint-disable-line @typescript-eslint/no-non-null-assertion
      value: user.orcid || '',
    },
    {
      field: fieldIdByTitle.Country!, // eslint-disable-line @typescript-eslint/no-non-null-assertion
      value: user.country || '',
    },
    {
      field: fieldIdByTitle.Region!, // eslint-disable-line @typescript-eslint/no-non-null-assertion
      value: user.region || '',
    },
    {
      field: fieldIdByTitle.Department!, // eslint-disable-line @typescript-eslint/no-non-null-assertion
      value: user.positions[0]?.department || '',
    },
    {
      field: fieldIdByTitle.Institution!, // eslint-disable-line @typescript-eslint/no-non-null-assertion
      value: user.positions[0]?.institution || '',
    },
    {
      field: fieldIdByTitle['GP2 Hub Role']!, // eslint-disable-line @typescript-eslint/no-non-null-assertion
      value: user.role || '',
    },
    {
      field: fieldIdByTitle['GP2 Working Group']!, // eslint-disable-line @typescript-eslint/no-non-null-assertion
      value: user.workingGroups.map((item) => item.title).join(', ') || '',
    },
    {
      field: fieldIdByTitle.Project!, // eslint-disable-line @typescript-eslint/no-non-null-assertion
      value: user.projects.map((item) => item.title).join(', ') || '',
    },
    {
      field: fieldIdByTitle.LinkedIn!, // eslint-disable-line @typescript-eslint/no-non-null-assertion
      value: user.social?.linkedIn || '',
    },
    {
      field: fieldIdByTitle.Network!, // eslint-disable-line @typescript-eslint/no-non-null-assertion
      value: '||GP2||',
    },
  ],
});

const updateContactLists = async (contactId: string) => {
  const listIdByName = await getListIdByName(
    activeCampaignAccount,
    activeCampaignToken,
  );

  const masterListId = listIdByName['Master List']!; // eslint-disable-line @typescript-eslint/no-non-null-assertion
  const CRNEmailListId = listIdByName['GP2 Hub Email list']!; // eslint-disable-line @typescript-eslint/no-non-null-assertion

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
    'GP2',
    new UserController(userDataProvider, assetDataProvider),
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
