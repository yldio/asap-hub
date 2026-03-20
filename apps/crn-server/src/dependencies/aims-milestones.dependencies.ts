import { getGraphQLClient as getContentfulGraphQLClient } from '@asap-hub/contentful';

import {
  contentfulAccessToken,
  contentfulEnvId,
  contentfulSpaceId,
} from '../config';
import { AimsMilestonesContentfulDataProvider } from '../data-providers/contentful/aims-milestones.data-provider';
import { AimsMilestonesDataProvider } from '../data-providers/types';

export const getAimsMilestonesDataProvider = (): AimsMilestonesDataProvider => {
  const contentfulGraphQLClient = getContentfulGraphQLClient({
    space: contentfulSpaceId,
    accessToken: contentfulAccessToken,
    environment: contentfulEnvId,
  });

  return new AimsMilestonesContentfulDataProvider(contentfulGraphQLClient);
};
