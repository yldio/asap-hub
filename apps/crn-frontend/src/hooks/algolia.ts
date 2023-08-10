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
  client: AlgoliaSearchClient<'crn'>;
};

export const useAlgolia = () => {
  const initAlgolia = (user: User | null): AlgoliaHook => {
    if (!user) {
      throw new Error('Algolia unavailable while not logged in');
    }

    if (user.algoliaApiKey === null) {
      throw new Error('Algolia unavailable while not onboarded');
    }

    const client = algoliaSearchClientFactory<'crn'>({
      algoliaAppId: ALGOLIA_APP_ID,
      algoliaIndex:
        (isEnabled('CONTENTFUL') && `${ALGOLIA_INDEX}-contentful`) ||
        ALGOLIA_INDEX,
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
  const user = useCurrentUserCRN();
  const [algolia, setAlgolia] = useState(initAlgolia(user));

  useEffect(() => {
    setAlgolia(initAlgolia(user));
  }, [user]);

  return algolia;
};

export const EMPTY_ALGOLIA_RESPONSE = {
  items: [],
  total: 0,
  algoliaIndexName: '',
  algoliaQueryId: '',
};
