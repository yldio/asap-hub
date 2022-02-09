import { useEffect, useState } from 'react';
import { useCurrentUser } from '@asap-hub/react-context';
import {
  algoliaSearchClientFactory,
  AlgoliaSearchClient,
} from '@asap-hub/algolia';
import { User } from '@asap-hub/auth';
import { ALGOLIA_INDEX } from '../config';

export type AlgoliaHook = {
  client: AlgoliaSearchClient;
};

export const useAlgolia = () => {
  const initAlgolia = (user: User | null): AlgoliaHook => {
    if (!user) {
      throw new Error('Algolia unavailable while not logged in');
    }

    const client = algoliaSearchClientFactory({
      algoliaIndex: ALGOLIA_INDEX,
      algoliaApiKey: user.algoliaApiKey,
    });

    return {
      client,
    };
  };
  const user = useCurrentUser();
  const [algolia, setAlgolia] = useState(initAlgolia(user));

  useEffect(() => {
    setAlgolia(initAlgolia(user));
  }, [user]);

  return algolia;
};
