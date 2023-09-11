import { getGraphQLClient as getContentfulGraphQLClient } from '@asap-hub/contentful';
import { EventDataProvider } from '@asap-hub/model';
import {
  contentfulAccessToken,
  contentfulEnvId,
  contentfulSpaceId,
} from '../config';
import { EventContentfulDataProvider } from '../data-providers/contentful/event.data-provider';
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
