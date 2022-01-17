import { useEffect, useState } from 'react';
import algoliasearch from 'algoliasearch/lite';
import { useCurrentUser } from '@asap-hub/react-context';
import { User } from '@asap-hub/auth';

import {
  ALGOLIA_APP_ID,
  ALGOLIA_INDEX,
  ALGOLIA_INDEX_REPLICA,
} from '../config';

export const INDEX = {
  primary: ALGOLIA_INDEX,
  ROSListing: ALGOLIA_INDEX_REPLICA,
};

export const useAlgolia = () => {
  const initAlgolia = (user: User | null) => {
    if (!user) {
      throw new Error('Algolia unavailable while not logged in');
    }
    const client = algoliasearch(ALGOLIA_APP_ID, user.algoliaApiKey);
    const index = client.initIndex(ALGOLIA_INDEX);
    return {
      client,
      index,
    };
  };
  const user = useCurrentUser();
  const [algolia, setAlgolia] = useState(initAlgolia(user));
  useEffect(() => {
    setAlgolia(initAlgolia(user));
  }, [user]);
  return algolia;
};
