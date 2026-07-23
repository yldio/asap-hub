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
  ResearchTagResponse,
  ResearchThemeResponse,
  ResearchThemeType,
  ResourceTypeResponse,
  ValidationErrorResponse,
} from '@asap-hub/model';
import { useMutation, useSuspenseQuery } from '@tanstack/react-query';
import { useAuthorization } from '../auth/useAuthorization';
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
import {
  useInvalidateResearchOutputIndex,
  useSetResearchOutputItem,
} from '../shared-research/state';
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

export const researchTagQueryKeys = {
  all: ['research-tags'] as const,
};

export const useResearchTags = (): ResearchTagResponse[] => {
  const getAuthorization = useAuthorization();
  return useSuspenseQuery({
    queryKey: researchTagQueryKeys.all,
    queryFn: async () => getResearchTags(await getAuthorization()),
  }).data;
};

export const researchThemeQueryKeys = {
  all: ['research-themes'] as const,
  byTypes: (typesKey: string) =>
    [...researchThemeQueryKeys.all, typesKey] as const,
};

export const useResearchThemes = (
  types?: ReadonlyArray<ResearchThemeType>,
): ResearchThemeResponse[] => {
  const getAuthorization = useAuthorization();
  // Keyed by the comma-joined types; an empty array means "all types".
  const typesKey = types ? types.join(',') : '';
  return useSuspenseQuery({
    queryKey: researchThemeQueryKeys.byTypes(typesKey),
    queryFn: async () =>
      getResearchThemes(
        await getAuthorization(),
        typesKey ? (typesKey.split(',') as ResearchThemeType[]) : undefined,
      ),
  }).data;
};

export const resourceTypeQueryKeys = {
  all: ['resource-types'] as const,
};

export const useResourceTypes = (): ResourceTypeResponse[] => {
  const getAuthorization = useAuthorization();
  return useSuspenseQuery({
    queryKey: resourceTypeQueryKeys.all,
    queryFn: async () => getResourceTypes(await getAuthorization()),
  }).data;
};

export const usePostResearchOutput = () => {
  const getAuthorization = useAuthorization();
  const setResearchOutputItem = useSetResearchOutputItem();
  const { mutateAsync } = useMutation({
    mutationFn: async (payload: ResearchOutputPostRequest) =>
      createResearchOutput(payload, await getAuthorization()),
    onSuccess: (researchOutput) => {
      setResearchOutputItem(researchOutput);
    },
  });
  return mutateAsync;
};

export const usePutResearchOutput = (shouldInvalidate?: boolean) => {
  const getAuthorization = useAuthorization();
  const setResearchOutputItem = useSetResearchOutputItem();
  const invalidateResearchOutputIndex = useInvalidateResearchOutputIndex();
  const { mutateAsync } = useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: ResearchOutputPutRequest;
    }) => updateTeamResearchOutput(id, payload, await getAuthorization()),
    onSuccess: (researchOutput) => {
      setResearchOutputItem(researchOutput);
      if (shouldInvalidate) {
        invalidateResearchOutputIndex();
      }
    },
  });
  return (id: string, payload: ResearchOutputPutRequest) =>
    mutateAsync({ id, payload });
};
