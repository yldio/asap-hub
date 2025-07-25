import { getGraphQLClient as getContentfulGraphQLClient } from '@asap-hub/contentful';
import {
  contentfulAccessToken,
  contentfulEnvId,
  contentfulSpaceId,
} from '../config';
import { ManuscriptVersionContentfulDataProvider } from '../data-providers/contentful/manuscript-version.data-provider';
import { ManuscriptVersionDataProvider } from '../data-providers/types';

export const getManuscriptVersionsDataProvider =
  (): ManuscriptVersionDataProvider => {
    const contentfulGraphQLClient = getContentfulGraphQLClient({
      space: contentfulSpaceId,
      accessToken: contentfulAccessToken,
      environment: contentfulEnvId,
    });

    return new ManuscriptVersionContentfulDataProvider(contentfulGraphQLClient);
  };
