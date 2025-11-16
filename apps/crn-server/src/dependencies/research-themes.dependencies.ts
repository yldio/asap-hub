import { getGraphQLClient as getContentfulGraphQLClient } from '@asap-hub/contentful';
import {
  contentfulAccessToken,
  contentfulEnvId,
  contentfulSpaceId,
} from '../config';
import { ResearchThemeContentfulDataProvider } from '../data-providers/contentful/research-theme.data-provider';
import { ResearchThemeDataProvider } from '../data-providers/types';

export const getResearchThemeDataProvider = (): ResearchThemeDataProvider => {
  const contentfulGraphQLClient = getContentfulGraphQLClient({
    space: contentfulSpaceId,
    accessToken: contentfulAccessToken,
    environment: contentfulEnvId,
  });

  return new ResearchThemeContentfulDataProvider(contentfulGraphQLClient);
};
