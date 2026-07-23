import { useSuspenseQuery } from '@tanstack/react-query';

import { useAuthorization } from '../auth/useAuthorization';
import { getContributingCohorts, getTags } from './api';

export const tagsQueryKeys = {
  all: ['tags'] as const,
};

export const contributingCohortsQueryKeys = {
  all: ['contributing-cohorts'] as const,
};

export const useTags = () => {
  const getAuthorization = useAuthorization();
  return useSuspenseQuery({
    queryKey: tagsQueryKeys.all,
    queryFn: async () => getTags(await getAuthorization()),
  }).data;
};

export const useContributingCohorts = () => {
  const getAuthorization = useAuthorization();
  return useSuspenseQuery({
    queryKey: contributingCohortsQueryKeys.all,
    queryFn: async () => getContributingCohorts(await getAuthorization()),
  }).data;
};
