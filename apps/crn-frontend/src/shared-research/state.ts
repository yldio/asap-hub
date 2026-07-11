import { expandUserRoles } from '@asap-hub/auth';
import { normalizeListOptions } from '@asap-hub/frontend-utils';
import {
  ListResearchOutputResponse,
  ResearchOutputResponse,
} from '@asap-hub/model';
import { useCurrentUserCRN } from '@asap-hub/react-context';
import {
  getUserRole,
  hasDuplicateResearchOutputPermission,
  hasEditResearchOutputPermission,
  hasPublishResearchOutputPermission,
  hasVersionResearchOutputPermission,
  hasRequestForReviewPermission,
  hasShareResearchOutputPermission,
} from '@asap-hub/validation';
import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { useCallback } from 'react';

import { useAuthorization } from '../auth/useAuthorization';
import { useAlgolia } from '../hooks/algolia';
import {
  getDraftResearchOutputs,
  getResearchOutput,
  getResearchOutputs,
  ResearchOutputListOptions,
} from './api';

export const researchOutputQueryKeys = {
  all: ['research-outputs'] as const,
  lists: () => [...researchOutputQueryKeys.all, 'list'] as const,
  list: (options: ResearchOutputListOptions) =>
    [
      ...researchOutputQueryKeys.lists(),
      normalizeListOptions(options),
    ] as const,
  details: () => [...researchOutputQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...researchOutputQueryKeys.details(), id] as const,
};

export const useResearchOutputById = (
  id: string,
): ResearchOutputResponse | undefined => {
  const getAuthorization = useAuthorization();
  const { data } = useSuspenseQuery({
    queryKey: researchOutputQueryKeys.detail(id),
    // getResearchOutput resolves undefined on a 404, but a queryFn must not
    // return undefined — cache null and map it back below.
    queryFn: async () =>
      (await getResearchOutput(id, await getAuthorization())) ?? null,
  });
  return data ?? undefined;
};

export const useResearchOutputs = (options: ResearchOutputListOptions) => {
  const { client } = useAlgolia();
  const getAuthorization = useAuthorization();
  return useSuspenseQuery({
    queryKey: researchOutputQueryKeys.list(options),
    queryFn: async (): Promise<ListResearchOutputResponse> => {
      try {
        if (options.draftsOnly) {
          return await getDraftResearchOutputs(
            options,
            await getAuthorization(),
          );
        }
        const data = await getResearchOutputs(client, options);
        return {
          total: data.nbHits ?? 0,
          items: data.hits,
          algoliaQueryId: data.queryID,
          algoliaIndexName: data.index,
        };
      } catch (error) {
        // Errors re-throw to the error boundary; non-Error rejections
        // become an empty list.
        if (error instanceof Error) {
          throw error;
        }
        return { total: 0, items: [] };
      }
    },
  }).data;
};

// Write-through used after research-output mutations (here and from
// network/teams/state.ts): the mutation response is written straight into the
// detail cache — never refetched, because Contentful has read-after-write
// lag — while the Algolia-backed lists are invalidated.
export const useSetResearchOutputItem = () => {
  const queryClient = useQueryClient();
  return useCallback(
    (researchOutput: ResearchOutputResponse) => {
      queryClient.setQueryData(
        researchOutputQueryKeys.detail(researchOutput.id),
        researchOutput,
      );
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      queryClient.invalidateQueries({
        queryKey: researchOutputQueryKeys.lists(),
      });
    },
    [queryClient],
  );
};

export const useInvalidateResearchOutputIndex = () => {
  const queryClient = useQueryClient();
  return useCallback(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    queryClient.invalidateQueries({
      queryKey: researchOutputQueryKeys.lists(),
    });
  }, [queryClient]);
};

export const useCanShareResearchOutput = (
  association: 'teams' | 'workingGroups',
  associationIds: string[],
  activeAssociation: boolean,
): boolean => {
  const user = useCurrentUserCRN();
  const userRole = getUserRole(
    user && expandUserRoles(user),
    association,
    associationIds,
  );
  return hasShareResearchOutputPermission(userRole) && activeAssociation;
};

export const useCanDuplicateResearchOutput = (
  association: 'teams' | 'workingGroups',
  associationIds: string[],
): boolean => {
  const user = useCurrentUserCRN();
  const originalAssociationUserRole = getUserRole(
    user && expandUserRoles(user),
    association,
    associationIds[0] ? [associationIds[0]] : [],
  );
  return hasDuplicateResearchOutputPermission(originalAssociationUserRole);
};

export const useResearchOutputPermissions = (
  association: 'teams' | 'workingGroups',
  associationIds: string[],
  published?: boolean,
  isManuscriptOutput: boolean = false,
) => {
  const user = useCurrentUserCRN();
  const expandedUser = user && expandUserRoles(user);
  const userRole = getUserRole(expandedUser, association, associationIds);
  const originalAssociationUserRole = getUserRole(
    expandedUser,
    association,
    associationIds[0] ? [associationIds[0]] : [],
  );
  return {
    canEditResearchOutput: hasEditResearchOutputPermission(
      userRole,
      published ?? false,
      isManuscriptOutput,
    ),
    canVersionResearchOutput: hasVersionResearchOutputPermission(
      userRole,
      isManuscriptOutput,
    ),
    canPublishResearchOutput: hasPublishResearchOutputPermission(
      userRole,
      isManuscriptOutput,
    ),
    canShareResearchOutput: hasShareResearchOutputPermission(userRole),
    canDuplicateResearchOutput: hasDuplicateResearchOutputPermission(
      originalAssociationUserRole,
    ),
    canRequestReview: hasRequestForReviewPermission(userRole),
  };
};
