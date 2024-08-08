import {
  AlgoliaClient,
  algoliaSearchClientFactory,
  Apps,
} from '@asap-hub/algolia';
import { User } from '@asap-hub/auth';
import { AnalyticsSortOptions, Metric } from '@asap-hub/model';
import { useCurrentUserCRN } from '@asap-hub/react-context';
import { useEffect, useState } from 'react';
import {
  ALGOLIA_APP_ID,
  ALGOLIA_INDEX,
  ANALYTICS_ALGOLIA_INDEX,
} from '../config';

export type AlgoliaHook<App extends Apps> = {
  client: AlgoliaClient<App>;
};

const initAlgolia = <App extends Apps>(
  user: User | null,
  indexName: string,
): AlgoliaHook<App> => {
  if (!user) {
    throw new Error('Algolia unavailable while not logged in');
  }

  const client = algoliaSearchClientFactory<App>({
    algoliaAppId: ALGOLIA_APP_ID,
    algoliaIndex: indexName,
    algoliaApiKey: user.algoliaApiKey,
    clickAnalytics: true,
    userToken: user.id,
  });
  window.dataLayer?.push({
    algoliaUserToken: user.id,
  });

  return {
    client,
  };
};

export const useAlgolia = () => {
  const user = useCurrentUserCRN();
  const [algolia, setAlgolia] = useState(
    initAlgolia<'crn'>(user, ALGOLIA_INDEX),
  );

  useEffect(() => {
    setAlgolia(initAlgolia<'crn'>(user, ALGOLIA_INDEX));
  }, [user]);

  return algolia;
};

export const useAnalyticsAlgolia = (index?: string) => {
  const user = useCurrentUserCRN();

  return initAlgolia<'analytics'>(user, index ?? ANALYTICS_ALGOLIA_INDEX);
};

export const getAlgoliaUserClient = (
  sort: AnalyticsSortOptions,
  metric: Metric,
) => {
  let indexName;
  switch (metric) {
    case 'team-collaboration':
    case 'team-productivity':
      indexName =
        sort === 'team_asc'
          ? ANALYTICS_ALGOLIA_INDEX
          : `${ANALYTICS_ALGOLIA_INDEX}_team_${sort.replace('team_', '')}`;
      break;
    case 'user-collaboration':
    case 'user-productivity':
      indexName =
        sort === 'user_asc'
          ? ANALYTICS_ALGOLIA_INDEX
          : `${ANALYTICS_ALGOLIA_INDEX}_user_${sort.replace('user_', '')}`;
      break;
    case 'team-leadership':
      indexName =
        sort === 'team_asc'
          ? ANALYTICS_ALGOLIA_INDEX
          : `${ANALYTICS_ALGOLIA_INDEX}_${sort}`;
      break;
    default:
      indexName = ANALYTICS_ALGOLIA_INDEX;
  }

  return useAnalyticsAlgolia(indexName).client;
};
