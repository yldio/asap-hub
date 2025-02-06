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
  ValidationErrorResponse,
} from '@asap-hub/model';
import { atom, selector, useRecoilValue } from 'recoil';
import { authorizationState } from '../auth/state';
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
  getResearchOutputs,
  getGeneratedResearchOutputContent,
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

const researchTagsState = atom<ResearchTagResponse[]>({
  key: 'researchTagsState',
  default: [],
});

export const researchTagsSelector = selector({
  key: 'researchTags',
  get: ({ get }) => {
    get(researchTagsState);
    const authorization = get(authorizationState);
    return getResearchTags(authorization);
  },
});

export const useResearchTags = () => useRecoilValue(researchTagsSelector);

export const usePostResearchOutput = () => {
  const authorization = useRecoilValue(authorizationState);
  const setResearchOutputItem = useSetResearchOutputItem();
  return async (payload: ResearchOutputPostRequest) => {
    const researchOutput = await createResearchOutput(payload, authorization);
    setResearchOutputItem(researchOutput);
    return researchOutput;
  };
};

export const usePutResearchOutput = (shouldInvalidate?: boolean) => {
  const authorization = useRecoilValue(authorizationState);
  const setResearchOutputItem = useSetResearchOutputItem();
  const invalidateResearchOutputIndex = useInvalidateResearchOutputIndex();
  return async (id: string, payload: ResearchOutputPutRequest) => {
    const researchOutput = await updateTeamResearchOutput(
      id,
      payload,
      authorization,
    );
    setResearchOutputItem(researchOutput);
    if (shouldInvalidate) {
      invalidateResearchOutputIndex();
    }
    return researchOutput;
  };
};

export const useResearchOutputGeneratedContent = () => {
  const authorization = useRecoilValue(authorizationState);

  return (descriptionMD: string): Promise<string> =>
    getGeneratedResearchOutputContent({ descriptionMD }, authorization).then(
      (output) => output.shortDescription || '',
    );
};
