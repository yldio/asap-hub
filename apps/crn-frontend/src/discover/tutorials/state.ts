import { GetListOptions } from '@asap-hub/frontend-utils';
import { ListTutorialsResponse, TutorialsResponse } from '@asap-hub/model';
import { useAuth0CRN } from '@asap-hub/react-context';
import { useSuspenseQuery } from '@tanstack/react-query';

import { getTutorialById, getTutorials } from './api';

export const tutorialsQueryKey = (options: GetListOptions) =>
  ['tutorials', 'list', options] as const;

export const tutorialQueryKey = (id: string) =>
  ['tutorials', 'item', id] as const;

export const useTutorials = (
  options: GetListOptions,
): ListTutorialsResponse => {
  const auth0 = useAuth0CRN();
  const { data } = useSuspenseQuery({
    queryKey: tutorialsQueryKey(options),
    queryFn: async (): Promise<ListTutorialsResponse> => {
      const token = await auth0.getTokenSilently();
      return getTutorials(options, `Bearer ${token}`);
    },
  });
  return data;
};

export const useTutorialById = (id: string): TutorialsResponse | undefined => {
  const auth0 = useAuth0CRN();
  // useSuspenseQuery requires a non-undefined queryFn result, so we normalise
  // the "not found" case to `null` inside the cache and back to `undefined`
  // at the boundary to preserve the consumer-facing contract.
  const { data } = useSuspenseQuery({
    queryKey: tutorialQueryKey(id),
    queryFn: async (): Promise<TutorialsResponse | null> => {
      const token = await auth0.getTokenSilently();
      const tutorial = await getTutorialById(id, `Bearer ${token}`);
      return tutorial ?? null;
    },
  });
  return data ?? undefined;
};
