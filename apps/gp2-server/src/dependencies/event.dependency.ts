import { getGraphQLClient as getContentfulGraphQLClient } from '@asap-hub/contentful';
import { gp2 as gp2Model } from '@asap-hub/model';
import {
  contentfulAccessToken,
  contentfulEnvId,
  contentfulSpaceId,
} from '../config';
import { EventContentfulDataProvider } from '../data-providers/event.data-provider';
import { getContentfulRestClientFactory } from './clients.dependency';

export const getEventDataProvider = (): gp2Model.EventDataProvider => {
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
