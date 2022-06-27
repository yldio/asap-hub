import {
  AlgoliaSearchClient,
  algoliaSearchClientFactory,
} from '@asap-hub/algolia';
import { User } from '@asap-hub/auth';
import { useCurrentUser } from '@asap-hub/react-context';
import { useCallback, useEffect, useState } from 'react';
import { ALGOLIA_APP_ID, ALGOLIA_INDEX } from '../config';

export type AlgoliaHook = {
  client: AlgoliaSearchClient;
};

export const useAlgolia = (algoliaIndex = ALGOLIA_INDEX) => {
  const initAlgolia = useCallback(
    (user: User | null): AlgoliaHook => {
      if (!user) {
        throw new Error('Algolia unavailable while not logged in');
      }

      const client = algoliaSearchClientFactory({
        algoliaAppId: ALGOLIA_APP_ID,
        algoliaIndex,
        algoliaApiKey: user.algoliaApiKey,
      });

      return {
        client,
      };
    },
    [algoliaIndex],
  );
  const user = useCurrentUser();
  const [algolia, setAlgolia] = useState(initAlgolia(user));

  useEffect(() => {
    setAlgolia(initAlgolia(user));
  }, [user, initAlgolia]);

  return algolia;
};
