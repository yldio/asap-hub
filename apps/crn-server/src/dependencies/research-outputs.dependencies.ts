import { getGraphQLClient as getContentfulGraphQLClient } from '@asap-hub/contentful';
import {
  contentfulAccessToken,
  contentfulPreviewAccessToken,
  contentfulEnvId,
  contentfulSpaceId,
} from '../config';
import { ResearchOutputContentfulDataProvider } from '../data-providers/contentful/research-output.data-provider';
import { ResearchOutputDataProvider } from '../data-providers/types';
import { getContentfulRestClientFactory } from './clients.dependencies';

export const getResearchOutputDataProvider = (): ResearchOutputDataProvider => {
  const contentfulGraphQLPreviewClient = getContentfulGraphQLClient({
    space: contentfulSpaceId,
    accessToken: contentfulPreviewAccessToken,
    environment: contentfulEnvId,
  });
  const contentfulGraphQLClient = getContentfulGraphQLClient({
    space: contentfulSpaceId,
    accessToken: contentfulAccessToken,
    environment: contentfulEnvId,
  });

  return new ResearchOutputContentfulDataProvider(
    contentfulGraphQLClient,
    contentfulGraphQLPreviewClient,
    getContentfulRestClientFactory,
  );
};
