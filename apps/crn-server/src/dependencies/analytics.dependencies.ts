import { getGraphQLClient as getContentfulGraphQLClient } from '@asap-hub/contentful';

import {
  contentfulAccessToken,
  contentfulEnvId,
  contentfulSpaceId,
} from '../config';
import { AnalyticsContentfulDataProvider } from '../data-providers/contentful/analytics.data-provider';
import { AnalyticsDataProvider } from '../data-providers/types';

export const getAnalyticsDataProvider = (): AnalyticsDataProvider => {
  const contentfulGraphQLClient = getContentfulGraphQLClient({
    space: contentfulSpaceId,
    accessToken: contentfulAccessToken,
    environment: contentfulEnvId,
  });

  return new AnalyticsContentfulDataProvider(contentfulGraphQLClient);
};
