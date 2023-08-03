import {
  AlgoliaSearchClient,
  algoliaSearchClientFactory,
} from '@asap-hub/algolia';
import { gp2 } from '@asap-hub/auth';
import { useCurrentUserGP2 } from '@asap-hub/react-context';
import { useEffect, useState } from 'react';
import { ALGOLIA_APP_ID, ALGOLIA_INDEX } from '../config';

export type AlgoliaHook = {
  client: AlgoliaSearchClient<'gp2'>;
};

export const useAlgolia = () => {
  const initAlgolia = (user: gp2.User | null): AlgoliaHook => {
    if (!user) {
      throw new Error('Algolia unavailable while not logged in');
    }

    const client = algoliaSearchClientFactory<'gp2'>({
      algoliaAppId: ALGOLIA_APP_ID,
      algoliaIndex: ALGOLIA_INDEX,
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
  const user = useCurrentUserGP2();
  const [algolia, setAlgolia] = useState(initAlgolia(user));

  useEffect(() => {
    setAlgolia(initAlgolia(user));
  }, [user]);

  return algolia;
};
