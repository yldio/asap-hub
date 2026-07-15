import {
  createQueryKeys,
  GetListOptions,
  nullOnUndefined,
} from '@asap-hub/frontend-utils';
import { TutorialsResponse } from '@asap-hub/model';
import { useSuspenseQuery } from '@tanstack/react-query';

import { useAuthorization } from '../../auth/useAuthorization';
import { getTutorialById, getTutorials } from './api';

export const tutorialQueryKeys = createQueryKeys<GetListOptions>('tutorials');

export const useTutorials = (options: GetListOptions) => {
  const getAuthorization = useAuthorization();
  return useSuspenseQuery({
    queryKey: tutorialQueryKeys.list(options),
    queryFn: async () => getTutorials(options, await getAuthorization()),
  }).data;
};

export const useTutorialById = (id: string): TutorialsResponse | undefined => {
  const getAuthorization = useAuthorization();
  const { data } = useSuspenseQuery({
    queryKey: tutorialQueryKeys.detail(id),
    queryFn: () =>
      nullOnUndefined(async () =>
        getTutorialById(id, await getAuthorization()),
      ),
  });
  return data ?? undefined;
};
