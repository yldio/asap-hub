import { getGraphQLClient as getContentfulGraphQLClient } from '@asap-hub/contentful';
import {
  contentfulAccessToken,
  contentfulEnvId,
  contentfulSpaceId,
} from '../config';
import { ResearchTagContentfulDataProvider } from '../data-providers/contentful/research-tag.data-provider';
import { ResearchTagDataProvider } from '../data-providers/types';

export const getResearchTagDataProvider = (): ResearchTagDataProvider => {
  const contentfulGraphQLClient = getContentfulGraphQLClient({
    space: contentfulSpaceId,
    accessToken: contentfulAccessToken,
    environment: contentfulEnvId,
  });

  return new ResearchTagContentfulDataProvider(contentfulGraphQLClient);
};
