import { gp2 as gp2Model } from '@asap-hub/model';
import type {
  ContactPayload,
  FieldValues,
  GP2FieldIdByTitle,
  GP2Fields,
} from '@asap-hub/server-common';
import {
  ActiveCampaign,
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

type CustomFieldsData = Record<GP2Fields, string>;

export const getContactPayload = (
  fieldIdByTitle: GP2FieldIdByTitle,
  user: gp2Model.UserResponse,
): ContactPayload => {
  const customFieldsData: CustomFieldsData = {
    ORCID: user.orcid || '',
    Nickname: user.nickname || '',
    Middlename: user.middleName || '',
    Country: user.country || '',
    Region: user.region || '',
    Department: user.positions[0]?.department || '',
    Institution: user.positions[0]?.institution || '',
    'GP2 Hub Role': user.role || '',
    'GP2 Working Group':
      user.workingGroups.map((item) => item.title).join(', ') || '',
    Project: user.projects.map((item) => item.title).join(', ') || '',
    LinkedIn: user.social?.linkedIn || '',
    Network: '||GP2||',
  };

  const fieldValues: FieldValues = [];
  const missingFields: string[] = [];

  Object.entries(customFieldsData).forEach(([fieldName, fieldValue]) => {
    const typedFieldName: GP2Fields = fieldName as GP2Fields;

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

const listNames = ['Master List', 'GP2 Hub Email list'];

const config = {
  activeCampaignAccount,
  activeCampaignToken,
  app: 'GP2' as 'GP2' | 'CRN',
};

export const handler = sentryWrapper(
  syncActiveCampaignContactFactory(
    config,
    ActiveCampaign,
    new UserController(userDataProvider, assetDataProvider),
    getContactPayload,
    listNames,
    logger,
  ),
);
