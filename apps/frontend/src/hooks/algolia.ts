import { useEffect, useState } from 'react';
import { useCurrentUser } from '@asap-hub/react-context';
import {
  algoliasearchLite,
  SearchClient,
  SearchIndex,
  ResearchOutputSearchIndex,
} from '@asap-hub/algolia';
import { User } from '@asap-hub/auth';

import { ALGOLIA_APP_ID, ALGOLIA_INDEX } from '../config';

export type AlgoliaHook = {
  client: SearchClient;
  index: {
    researchOutput: ResearchOutputSearchIndex;
  };
};

export const useAlgolia = () => {
  const initAlgolia = (user: User | null): AlgoliaHook => {
    if (!user) {
      throw new Error('Algolia unavailable while not logged in');
    }

    const client = algoliasearchLite(
      ALGOLIA_APP_ID,
      user.algoliaApiKey,
    ) as SearchClient;
    const researchOutput = new ResearchOutputSearchIndex(
      client.initIndex(ALGOLIA_INDEX) as SearchIndex,
    );

    return {
      client,
      index: {
        researchOutput,
      },
    };
  };
  const user = useCurrentUser();
  const [algolia, setAlgolia] = useState(initAlgolia(user));

  useEffect(() => {
    setAlgolia(initAlgolia(user));
  }, [user]);

  return algolia;
};
