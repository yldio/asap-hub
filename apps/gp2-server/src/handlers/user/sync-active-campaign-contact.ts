/* istanbul ignore file */
import { gp2 as gp2Model } from '@asap-hub/model';
import {
  ContactPayload,
  getCustomFieldIdByTitle,
  getCustomFields,
  syncActiveCampaignContactFactory,
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

const getContactPayload = async (
  user: gp2Model.UserResponse,
): Promise<ContactPayload> => {
  const customFields = await getCustomFields(
    activeCampaignAccount,
    activeCampaignToken,
  );

  const fieldIdByTitle = getCustomFieldIdByTitle(customFields);

  return {
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
        value: user.workingGroups[0]?.title || '',
      },
      {
        field: fieldIdByTitle.Project!, // eslint-disable-line @typescript-eslint/no-non-null-assertion
        value: user.projects[0]?.title || '',
      },
      {
        field: fieldIdByTitle.LinkedIn!, // eslint-disable-line @typescript-eslint/no-non-null-assertion
        value: user.social?.linkedIn || '',
      },
    ],
  };
};

export const handler = sentryWrapper(
  syncActiveCampaignContactFactory(
    new UserController(userDataProvider, assetDataProvider),
    logger,
    activeCampaignAccount,
    activeCampaignToken,
    getContactPayload,
  ),
);
