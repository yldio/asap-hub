import { getGraphQLClient as getContentfulGraphQLClient } from '@asap-hub/contentful';
import { SquidexGraphql } from '@asap-hub/squidex';
import {
  appName,
  baseUrl,
  contentfulAccessToken,
  contentfulEnvId,
  contentfulSpaceId,
  isContentfulEnabled,
} from '../config';
import { ResearchTagContentfulDataProvider } from '../data-providers/contentful/research-tag.data-provider';
import { ResearchTagDataProvider } from '../data-providers/types';
import { ResearchTagSquidexDataProvider } from '../data-providers/research-tag.data-provider';
import { getAuthToken } from '../utils/auth';

export const getResearchTagDataProvider = (): ResearchTagDataProvider => {
  if (isContentfulEnabled) {
    const contentfulGraphQLClient = getContentfulGraphQLClient({
      space: contentfulSpaceId,
      accessToken: contentfulAccessToken,
      environment: contentfulEnvId,
    });

    return new ResearchTagContentfulDataProvider(contentfulGraphQLClient);
  }

  const squidexGraphqlClient = new SquidexGraphql(getAuthToken, {
    appName,
    baseUrl,
  });

  return new ResearchTagSquidexDataProvider(squidexGraphqlClient);
};
