import {
  Environment,
  getGraphQLClient,
  getRestClient,
} from '@asap-hub/contentful';
import {
  contentfulAccessToken,
  contentfulEnvId,
  contentfulManagementAccessToken,
  contentfulSpaceId,
} from '../config';

export const getContentfulRestClientFactory = (): Promise<Environment> =>
  getRestClient({
    space: contentfulSpaceId,
    accessToken: contentfulManagementAccessToken,
    environment: contentfulEnvId,
  });

export const getContentfulGraphQLClientFactory = () =>
  getGraphQLClient({
    space: contentfulSpaceId,
    accessToken: contentfulAccessToken,
    environment: contentfulEnvId,
  });
