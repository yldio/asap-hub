import { getGraphQLClient as getContentfulGraphQLClient } from '@asap-hub/contentful';
import {
  contentfulAccessToken,
  contentfulEnvId,
  contentfulSpaceId,
} from '../config';
import { InterestGroupContentfulDataProvider } from '../data-providers/contentful/interest-group.data-provider';
import { InterestGroupDataProvider } from '../data-providers/types';

export const getInterestGroupDataProvider = (): InterestGroupDataProvider => {
  const contentfulGraphQLClient = getContentfulGraphQLClient({
    space: contentfulSpaceId,
    accessToken: contentfulAccessToken,
    environment: contentfulEnvId,
  });

  return new InterestGroupContentfulDataProvider(contentfulGraphQLClient);
};
