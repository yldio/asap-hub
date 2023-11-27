import { getGraphQLClient as getContentfulGraphQLClient } from '@asap-hub/contentful';
import {
  contentfulAccessToken,
  contentfulEnvId,
  contentfulSpaceId,
} from '../config';
import { TutorialContentfulDataProvider } from '../data-providers/contentful/tutorial.data-provider';
import { TutorialDataProvider } from '../data-providers/types';

export const getTutorialDataProvider = (): TutorialDataProvider => {
  const contentfulGraphQLClient = getContentfulGraphQLClient({
    space: contentfulSpaceId,
    accessToken: contentfulAccessToken,
    environment: contentfulEnvId,
  });

  return new TutorialContentfulDataProvider(contentfulGraphQLClient);
};
