import { getGraphQLClient as getContentfulGraphQLClient } from '@asap-hub/contentful';
import {
  contentfulAccessToken,
  contentfulEnvId,
  contentfulSpaceId,
} from '../config';
import { EventContentfulDataProvider } from '../data-providers/contentful/event.data-provider';
import { EventDataProvider } from '../data-providers/types';
import { getContentfulRestClientFactory } from './clients.dependencies';

export const getEventDataProvider = (): EventDataProvider => {
  const contentfulGraphQLClient = getContentfulGraphQLClient({
    space: contentfulSpaceId,
    accessToken: contentfulAccessToken,
    environment: contentfulEnvId,
  });

  return new EventContentfulDataProvider(
    contentfulGraphQLClient,
    getContentfulRestClientFactory,
  );
};
