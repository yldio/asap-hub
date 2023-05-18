import { Environment, getRestClient } from '@asap-hub/contentful';
import {
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
