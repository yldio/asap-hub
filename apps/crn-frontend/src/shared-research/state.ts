import {
  ListResearchOutputResponse,
  ResearchOutputResponse,
} from '@asap-hub/model';
import { useAuth0CRN, useCurrentUserCRN } from '@asap-hub/react-context';
import {
  getUserRole,
  hasDuplicateResearchOutputPermission,
  hasEditResearchOutputPermission,
  hasPublishResearchOutputPermission,
  hasVersionResearchOutputPermission,
  hasRequestForReviewPermission,
  hasShareResearchOutputPermission,
} from '@asap-hub/validation';
import { useSuspenseQuery, useQueryClient } from '@tanstack/react-query';
import { useAlgolia } from '../hooks/algolia';
import {
  getDraftResearchOutputs,
  getResearchOutput,
  getResearchOutputs,
  ResearchOutputListOptions,
} from './api';

export const useResearchOutputById = (id: string) => {
  const auth0 = useAuth0CRN();
  const { data } = useSuspenseQuery({
    queryKey: ['researchOutput', id],
    queryFn: async () => {
      const token = await auth0.getTokenSilently();
      const result = await getResearchOutput(id, `Bearer ${token}`);
      return result ?? null;
    },
  });
  return data;
};

export const useResearchOutputs = (options: ResearchOutputListOptions) => {
  const auth0 = useAuth0CRN();
  const { client } = useAlgolia();
  const { data } = useSuspenseQuery({
    queryKey: [
      'researchOutputs',
      { ...options, filters: options.filters ? [...options.filters] : [] },
    ],
    queryFn: async (): Promise<ListResearchOutputResponse> => {
      if (options.draftsOnly) {
        const token = await auth0.getTokenSilently();
        return getDraftResearchOutputs(options, `Bearer ${token}`);
      }
      const result = await getResearchOutputs(client, options);
      return {
        total: result.nbHits,
        items: result.hits,
        algoliaQueryId: result.queryID,
        algoliaIndexName: result.index,
      };
    },
  });
  return data;
};

export const useCanShareResearchOutput = (
  association: 'teams' | 'workingGroups',
  associationIds: string[],
  activeAssociation: boolean,
): boolean => {
  const user = useCurrentUserCRN();
  const userRole = getUserRole(user, association, associationIds);
  return hasShareResearchOutputPermission(userRole) && activeAssociation;
};

export const useCanDuplicateResearchOutput = (
  association: 'teams' | 'workingGroups',
  associationIds: string[],
): boolean => {
  const user = useCurrentUserCRN();
  const originalAssociationUserRole = getUserRole(
    user,
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
  const userRole = getUserRole(user, association, associationIds);
  const originalAssociationUserRole = getUserRole(
    user,
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

/**
 * Compatibility shim used by network/teams/state.ts which is not yet migrated.
 * Updates the TanStack Query cache for a single research output and invalidates
 * the list so it refetches. Remove once teams state is migrated.
 */
export const useSetResearchOutputItem = () => {
  const queryClient = useQueryClient();
  return async (researchOutput: ResearchOutputResponse) => {
    queryClient.setQueryData(
      ['researchOutput', researchOutput.id],
      researchOutput,
    );
    await queryClient.invalidateQueries({ queryKey: ['researchOutputs'] });
  };
};
