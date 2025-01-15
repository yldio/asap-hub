import { getGraphQLClient as getContentfulGraphQLClient } from '@asap-hub/contentful';
import {
  contentfulAccessToken,
  contentfulEnvId,
  contentfulSpaceId,
} from '../config';
import { ManuscriptContentfulDataProvider } from '../data-providers/contentful/manuscript.data-provider';
import { ManuscriptDataProvider } from '../data-providers/types';
import { getContentfulRestClientFactory } from './clients.dependencies';

export const getManuscriptsDataProvider = (): ManuscriptDataProvider => {
  const contentfulGraphQLClient = getContentfulGraphQLClient({
    space: contentfulSpaceId,
    accessToken: contentfulAccessToken,
    environment: contentfulEnvId,
  });

  return new ManuscriptContentfulDataProvider(
    contentfulGraphQLClient,
    getContentfulRestClientFactory,
  );
};
