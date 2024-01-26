/* istanbul ignore file */
import { UserResponse } from '@asap-hub/model';
import {
  ContactPayload,
  getCustomFieldIdByTitle,
  getCustomFields,
  syncActiveCampaignContactFactory,
} from '@asap-hub/server-common';
import { activeCampaignAccount, activeCampaignToken } from '../../config';
import UserController from '../../controllers/user.controller';
import {
  getUserDataProvider,
  getAssetDataProvider,
} from '../../dependencies/users.dependencies';
import logger from '../../utils/logger';
import { sentryWrapper } from '../../utils/sentry-wrapper';

const userDataProvider = getUserDataProvider();
const assetDataProvider = getAssetDataProvider();

const getContactPayload = async (
  user: UserResponse,
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
        field: fieldIdByTitle.Team!, // eslint-disable-line @typescript-eslint/no-non-null-assertion
        value: user.teams.length ? `Team ${user.teams[0]!.displayName!}` : '', // eslint-disable-line @typescript-eslint/no-non-null-assertion
      },
      {
        field: fieldIdByTitle['CRN Team Role']!, // eslint-disable-line @typescript-eslint/no-non-null-assertion
        value: user.teams[0]?.role || '',
      },
      {
        field: fieldIdByTitle.Lab!, // eslint-disable-line @typescript-eslint/no-non-null-assertion
        value: user.labs[0]?.name || '',
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
        value: user.workingGroups[0]?.name || '',
      },
      {
        field: fieldIdByTitle['Interest Group']!, // eslint-disable-line @typescript-eslint/no-non-null-assertion
        value: user.interestGroups[0]?.name || '',
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
