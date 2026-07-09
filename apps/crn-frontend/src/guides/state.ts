import { ListGuideResponse } from '@asap-hub/model';
import { useSuspenseQuery } from '@tanstack/react-query';

import { useAuthorization } from '../auth/useAuthorization';
import { getGuides } from './api';

export const guideQueryKeys = {
  all: ['guides'] as const,
  collections: () => [...guideQueryKeys.all, 'collection'] as const,
  collection: (title: string) =>
    [...guideQueryKeys.collections(), title] as const,
};

export const useGuidesByCollection = (
  collection: string,
): ListGuideResponse | undefined => {
  const getAuthorization = useAuthorization();
  return useSuspenseQuery({
    queryKey: guideQueryKeys.collection(collection),
    queryFn: async () => getGuides(await getAuthorization(), collection),
  }).data;
};
