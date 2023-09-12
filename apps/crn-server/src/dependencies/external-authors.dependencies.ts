import { getGraphQLClient as getContentfulGraphQLClient } from '@asap-hub/contentful';
import {
  contentfulAccessToken,
  contentfulEnvId,
  contentfulSpaceId,
} from '../config';
import { ExternalAuthorContentfulDataProvider } from '../data-providers/contentful/external-author.data-provider';
import { ExternalAuthorDataProvider } from '../data-providers/types/external-authors.data-provider.types';
import { getContentfulRestClientFactory } from './clients.dependencies';

export const getExternalAuthorDataProvider = (): ExternalAuthorDataProvider => {
  const contentfulGraphQLClient = getContentfulGraphQLClient({
    space: contentfulSpaceId,
    accessToken: contentfulAccessToken,
    environment: contentfulEnvId,
  });

  return new ExternalAuthorContentfulDataProvider(
    contentfulGraphQLClient,
    getContentfulRestClientFactory,
  );
};
