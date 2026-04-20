import { OutputDocumentTypeParameter } from '@asap-hub/routing';
import {
  BackendError,
  validationErrorsAreSupported,
} from '@asap-hub/frontend-utils';

import {
  isValidationErrorResponse,
  ResearchOutputDocumentType,
  ResearchOutputPostRequest,
  ResearchOutputPutRequest,
  ValidationErrorResponse,
} from '@asap-hub/model';
import { useAuth0CRN } from '@asap-hub/react-context';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAlgolia } from '../hooks/algolia';
import {
  createResearchOutput,
  updateTeamResearchOutput,
} from '../network/teams/api';
import {
  getOpenScienceMembers,
  getUsersAndExternalAuthors,
} from '../network/users/api';
import {
  getResearchTags,
  getResearchThemes,
  getResourceTypes,
  getResearchOutputs,
} from '../shared-research/api';
import { getEvents } from '../events/api';

export function paramOutputDocumentTypeToResearchOutputDocumentType(
  data: OutputDocumentTypeParameter,
): ResearchOutputDocumentType {
  switch (data) {
    case 'article':
      return 'Article';
    case 'bioinformatics':
      return 'Bioinformatics';
    case 'dataset':
      return 'Dataset';
    case 'lab-material':
      return 'Lab Material';
    case 'protocol':
      return 'Protocol';
    case 'report':
      return 'Report';
    default:
      return 'Article';
  }
}

export const handleError =
  (
    supportedErrors: string[],
    setErrors: (errors: ValidationErrorResponse['data']) => void,
  ) =>
  (error: unknown) => {
    if (error instanceof BackendError) {
      const { response } = error;
      if (
        isValidationErrorResponse(response) &&
        validationErrorsAreSupported(response, supportedErrors)
      ) {
        setErrors(response.data);
        return;
      }
    }
    throw error;
  };

export const useRelatedResearchSuggestions = (currentId?: string) => {
  const algoliaClient = useAlgolia();
  return (searchQuery: string) =>
    getResearchOutputs(algoliaClient.client, {
      searchQuery,
      filters: new Set(),
      currentPage: null,
      pageSize: null,
    })
      .then(({ hits }) =>
        hits.map(({ id, title, type, documentType }) => ({
          label: title,
          value: id,
          type,
          documentType,
        })),
      )
      .then((hits) =>
        currentId ? hits.filter(({ value }) => value !== currentId) : hits,
      );
};

export const useRelatedEventsSuggestions = () => {
  const algoliaClient = useAlgolia();
  return (searchQuery: string) =>
    getEvents(algoliaClient.client, {
      searchQuery,
      filters: new Set(),
      currentPage: null,
      pageSize: null,
      after: '',
    }).then(({ items }) =>
      items.map(({ id, title, endDate }) => ({
        label: title,
        value: id,
        endDate,
      })),
    );
};

export const useAssignedUsersSuggestions = () => {
  const algoliaClient = useAlgolia();

  return (searchQuery: string) =>
    getOpenScienceMembers(algoliaClient.client, {
      searchQuery,
      currentPage: null,
      pageSize: 100,
      filters: new Set(),
    }).then(({ items }) => items);
};

export const useAuthorSuggestions = () => {
  const algoliaClient = useAlgolia();

  return (searchQuery: string) =>
    getUsersAndExternalAuthors(algoliaClient.client, {
      searchQuery,
      currentPage: null,
      pageSize: 100,
      filters: new Set(),
    }).then(({ items }) => items);
};

export const useResearchTags = () => {
  const auth0 = useAuth0CRN();
  const { data } = useQuery({
    queryKey: ['researchTags'],
    queryFn: async () => {
      const token = await auth0.getTokenSilently();
      return getResearchTags(`Bearer ${token}`);
    },
  });
  return data ?? [];
};

export const useResearchThemes = () => {
  const auth0 = useAuth0CRN();
  const { data } = useQuery({
    queryKey: ['researchThemes'],
    queryFn: async () => {
      const token = await auth0.getTokenSilently();
      return getResearchThemes(`Bearer ${token}`);
    },
  });
  return data ?? [];
};

export const useResourceTypes = () => {
  const auth0 = useAuth0CRN();
  const { data } = useQuery({
    queryKey: ['resourceTypes'],
    queryFn: async () => {
      const token = await auth0.getTokenSilently();
      return getResourceTypes(`Bearer ${token}`);
    },
  });
  return data ?? [];
};

export const usePostResearchOutput = () => {
  const auth0 = useAuth0CRN();
  const queryClient = useQueryClient();
  const { mutateAsync } = useMutation({
    mutationKey: ['createResearchOutput'],
    mutationFn: async (payload: ResearchOutputPostRequest) => {
      const token = await auth0.getTokenSilently();
      return createResearchOutput(payload, `Bearer ${token}`);
    },
    onSuccess: async (researchOutput) => {
      queryClient.setQueryData(
        ['researchOutput', researchOutput.id],
        researchOutput,
      );
      await queryClient.invalidateQueries({ queryKey: ['researchOutputs'] });
    },
  });
  return mutateAsync;
};

export const usePutResearchOutput = (shouldInvalidate?: boolean) => {
  const auth0 = useAuth0CRN();
  const queryClient = useQueryClient();
  const { mutateAsync } = useMutation({
    mutationKey: ['updateResearchOutput'],
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: ResearchOutputPutRequest;
    }) => {
      const token = await auth0.getTokenSilently();
      return updateTeamResearchOutput(id, payload, `Bearer ${token}`);
    },
    onSuccess: async (researchOutput) => {
      queryClient.setQueryData(
        ['researchOutput', researchOutput.id],
        researchOutput,
      );
      if (shouldInvalidate) {
        await queryClient.invalidateQueries({ queryKey: ['researchOutputs'] });
      }
    },
  });
  return (id: string, payload: ResearchOutputPutRequest) =>
    mutateAsync({ id, payload });
};
