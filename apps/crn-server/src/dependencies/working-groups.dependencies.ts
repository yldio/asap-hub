import { getGraphQLClient as getContentfulGraphQLClient } from '@asap-hub/contentful';
import {
  RestWorkingGroup,
  SquidexGraphql,
  SquidexRest,
} from '@asap-hub/squidex';
import {
  appName,
  baseUrl,
  contentfulAccessToken,
  contentfulEnvId,
  contentfulSpaceId,
  isContentfulEnabledV2,
} from '../config';
import { WorkingGroupContentfulDataProvider } from '../data-providers/contentful/working-group.data-provider';
import { WorkingGroupSquidexDataProvider } from '../data-providers/working-group.data-provider';

import { WorkingGroupDataProvider } from '../data-providers/types';
import { getAuthToken } from '../utils/auth';
import { getContentfulRestClientFactory } from './clients.dependencies';

export const getWorkingGroupDataProvider = (): WorkingGroupDataProvider => {
  if (isContentfulEnabledV2) {
    const contentfulGraphQLClient = getContentfulGraphQLClient({
      space: contentfulSpaceId,
      accessToken: contentfulAccessToken,
      environment: contentfulEnvId,
    });

    return new WorkingGroupContentfulDataProvider(
      contentfulGraphQLClient,
      getContentfulRestClientFactory,
    );
  }

  const squidexGraphqlClient = new SquidexGraphql(getAuthToken, {
    appName,
    baseUrl,
  });

  const squidexRestClient = new SquidexRest<RestWorkingGroup>(
    getAuthToken,
    'working-groups',
    {
      appName,
      baseUrl,
    },
  );

  return new WorkingGroupSquidexDataProvider(
    squidexGraphqlClient,
    squidexRestClient,
  );
};
