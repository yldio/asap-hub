import {
  AlgoliaSearchClient,
  algoliaSearchClientFactory,
} from '@asap-hub/algolia';
import { User } from '@asap-hub/auth';
import { isEnabled } from '@asap-hub/flags';
import { useCurrentUserCRN } from '@asap-hub/react-context';
import { useEffect, useState } from 'react';
import { ALGOLIA_APP_ID, ALGOLIA_INDEX } from '../config';

export type AlgoliaHook = {
  client: AlgoliaSearchClient;
};

export const useAlgolia = () => {
  const initAlgolia = (user: User | null): AlgoliaHook => {
    if (!user) {
      throw new Error('Algolia unavailable while not logged in');
    }

    const client = algoliaSearchClientFactory({
      algoliaAppId: ALGOLIA_APP_ID,
      algoliaIndex:
        (isEnabled('CONTENTFUL') && `${ALGOLIA_INDEX}-contentful`) ||
        ALGOLIA_INDEX,
      algoliaApiKey: user.algoliaApiKey,
    });

    return {
      client,
    };
  };
  const user = useCurrentUserCRN();
  const [algolia, setAlgolia] = useState(initAlgolia(user));

  useEffect(() => {
    setAlgolia(initAlgolia(user));
  }, [user]);

  return algolia;
};
