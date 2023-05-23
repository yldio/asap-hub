import { getGraphQLClient as getContentfulGraphQLClient } from '@asap-hub/contentful';
import { EventDataProvider } from '@asap-hub/model';
import { RestEvent, SquidexGraphql, SquidexRest } from '@asap-hub/squidex';
import {
  appName,
  baseUrl,
  contentfulAccessToken,
  contentfulEnvId,
  contentfulSpaceId,
  isContentfulEnabledV2,
} from '../config';
import { EventSquidexDataProvider } from '../data-providers/event.data-provider';
import { EventContentfulDataProvider } from '../data-providers/contentful/event.data-provider';
import { getAuthToken } from '../utils/auth';
import { getContentfulRestClientFactory } from './clients.dependencies';

export const getEventDataProvider = (): EventDataProvider => {
  if (isContentfulEnabledV2) {
    const contentfulGraphQLClient = getContentfulGraphQLClient({
      space: contentfulSpaceId,
      accessToken: contentfulAccessToken,
      environment: contentfulEnvId,
    });

    return new EventContentfulDataProvider(
      contentfulGraphQLClient,
      getContentfulRestClientFactory,
    );
  }

  const squidexGraphqlClient = new SquidexGraphql(getAuthToken, {
    appName,
    baseUrl,
  });
  const eventRestClient = new SquidexRest<RestEvent>(getAuthToken, 'events', {
    appName,
    baseUrl,
  });

  return new EventSquidexDataProvider(eventRestClient, squidexGraphqlClient);
};
