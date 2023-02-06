import {
  TeamOutputDocumentTypeParameter,
  WorkingGroupOutputDocumentTypeParameter,
} from '@asap-hub/routing';
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
import { authorizationState } from './auth/state';
import { useAlgolia } from './hooks/algolia';
import {
  createResearchOutput,
  getLabs,
  getTeams,
  updateTeamResearchOutput,
} from './network/teams/api';
import { getUsersAndExternalAuthors } from './network/users/api';
import { getResearchTags } from './shared-research/api';
import { useSetResearchOutputItem } from './shared-research/state';

export function paramOutputDocumentTypeToResearchOutputDocumentType(
  data:
    | TeamOutputDocumentTypeParameter
    | WorkingGroupOutputDocumentTypeParameter,
): ResearchOutputDocumentType {
  switch (data) {
    case 'article':
      return 'Article';
    case 'bioinformatics':
      return 'Bioinformatics';
    case 'dataset':
      return 'Dataset';
    case 'lab-resource':
      return 'Lab Resource';
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

export const useLabSuggestions = () => {
  const authorization = useRecoilValue(authorizationState);
  return (searchQuery: string) =>
    getLabs(
      { searchQuery, filters: new Set(), currentPage: null, pageSize: null },
      authorization,
    ).then(({ items }) =>
      items.map(({ id, name }) => ({ label: `${name} Lab`, value: id })),
    );
};

export const useTeamSuggestions = () => {
  const authorization = useRecoilValue(authorizationState);
  return (searchQuery: string) =>
    getTeams(
      { searchQuery, filters: new Set(), currentPage: null, pageSize: null },
      authorization,
    ).then(({ items }) =>
      items.map(({ id, displayName }) => ({
        label: displayName,
        value: id,
      })),
    );
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

export const usePutResearchOutput = () => {
  const authorization = useRecoilValue(authorizationState);
  const setResearchOutputItem = useSetResearchOutputItem();
  return async (id: string, payload: ResearchOutputPutRequest) => {
    const researchOutput = await updateTeamResearchOutput(
      id,
      payload,
      authorization,
    );
    setResearchOutputItem(researchOutput);
    return researchOutput;
  };
};
