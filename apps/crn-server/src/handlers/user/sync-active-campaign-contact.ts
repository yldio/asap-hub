import { UserResponse } from '@asap-hub/model';
import type {
  ContactPayload,
  CRNFieldIdByTitle,
  CRNFields,
  FieldValues,
} from '@asap-hub/server-common';
import {
  ActiveCampaign,
  syncActiveCampaignContactFactory,
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

type CustomFieldsData = Record<CRNFields, string>;

export const getContactPayload = (
  fieldIdByTitle: CRNFieldIdByTitle,
  user: UserResponse,
): ContactPayload => {
  const getTeamDisplayName = (index: number): string =>
    user.teams[index]?.displayName ?? '';
  const getTeamRole = (index: number): string => user.teams[index]?.role ?? '';
  const getTeamStatus = (index: number): string =>
    user.teams[index]
      ? user.teams[index]?.inactiveSinceDate ||
        user.teams[index]?.teamInactiveSince
        ? 'Inactive'
        : 'Active'
      : '';

  const customFieldsData: CustomFieldsData = {
    Lab: user.labs.map((item) => item.name).join(', '),
    ORCID: user.orcid || '',
    Nickname: user.nickname || '',
    Middlename: user.middleName || '',
    Alumnistatus: user.alumniSinceDate ? 'Alumni' : 'Non Alumni',
    Country: user.country || '',
    Institution: user.institution || '',
    'Working Group': user.workingGroups.map((item) => item.name).join(', '),
    'Interest Group': user.interestGroups.map((item) => item.name).join(', '),
    LinkedIn: user.social?.linkedIn || '',
    Network: '||ASAP CRN||',
    'CRN Team 1': getTeamDisplayName(0),
    'CRN Team Role 1': getTeamRole(0),
    'CRN Team Status 1': getTeamStatus(0),
    'CRN Team 2': getTeamDisplayName(1),
    'CRN Team Role 2': getTeamRole(1),
    'CRN Team Status 2': getTeamStatus(1),
    'CRN Team 3': getTeamDisplayName(2),
    'CRN Team Role 3': getTeamRole(2),
    'CRN Team Status 3': getTeamStatus(2),
  };

  const fieldValues: FieldValues = [];
  const missingFields: string[] = [];
  Object.entries(customFieldsData).forEach(([fieldName, fieldValue]) => {
    const typedFieldName: CRNFields = fieldName as CRNFields;

    if (
      typedFieldName in fieldIdByTitle &&
      typeof fieldIdByTitle[typedFieldName] === 'string'
    ) {
      fieldValues.push({
        field: fieldIdByTitle[typedFieldName],
        value: fieldValue,
      });
    } else {
      missingFields.push(fieldName);
    }
  });

  if (missingFields.length > 0) {
    throw new Error(
      `The following fields ${missingFields.join(
        ', ',
      )} are missing from the ActiveCampaign environment`,
    );
  }

  return {
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    fieldValues,
  };
};

export const listNames = ['Master List', 'CRN HUB Email List'];

export const config = {
  activeCampaignAccount,
  activeCampaignToken,
  app: 'CRN' as 'GP2' | 'CRN',
};

export const handler = sentryWrapper(
  syncActiveCampaignContactFactory(
    config,
    ActiveCampaign,
    new UserController(
      userDataProvider,
      assetDataProvider,
      researchTagDataProvider,
    ),
    getContactPayload,
    listNames,
    logger,
  ),
);
