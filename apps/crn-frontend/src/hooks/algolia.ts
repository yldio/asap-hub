import {
  AlgoliaClient,
  algoliaSearchClientFactory,
  Apps,
} from '@asap-hub/algolia';
import { User } from '@asap-hub/auth';
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
