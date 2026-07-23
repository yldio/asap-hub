import { DiscoverResponse } from '@asap-hub/model';
import { useSuspenseQuery } from '@tanstack/react-query';

import { useAuthorization } from '../auth/useAuthorization';
import { getDiscover } from './api';

export const discoverQueryKeys = {
  all: ['discover'] as const,
};

export const useDiscoverState = (): DiscoverResponse => {
  const getAuthorization = useAuthorization();
  return useSuspenseQuery({
    queryKey: discoverQueryKeys.all,
    queryFn: async () => getDiscover(await getAuthorization()),
  }).data;
};
