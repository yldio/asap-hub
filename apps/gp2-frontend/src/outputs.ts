import {
  BackendError,
  validationErrorsAreSupported,
} from '@asap-hub/frontend-utils';
import {
  isValidationErrorResponse,
  ValidationErrorResponse,
} from '@asap-hub/model';
import { useRecoilValue } from 'recoil';
import { authorizationState } from './auth/state';
import { getEvents } from './events/api';
import { useAlgolia } from './hooks/algolia';
import { getGeneratedOutputContent, getOutputs } from './outputs/api';
import { getUsersAndExternalUsers } from './users/api';

export const useRelatedOutputSuggestions = (currentId?: string) => {
  const algoliaClient = useAlgolia();
  return (searchQuery: string) =>
    getOutputs(algoliaClient.client, {
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
    }).then(({ hits }) =>
      hits.map(({ id, title, endDate }) => ({
        label: title,
        value: id,
        endDate,
      })),
    );
};

export const useAuthorSuggestions = () => {
  const algoliaClient = useAlgolia();

  return (searchQuery: string) =>
    getUsersAndExternalUsers(algoliaClient.client, {
      searchQuery,
      currentPage: null,
      pageSize: 100,
      filters: new Set(),
    })
      .then(({ items }) => items)
      .then((items) =>
        items.map((author) => ({
          author,
          label: author.displayName,
          value: author.id,
        })),
      );
};

export const useOutputGeneratedContent = () => {
  const authorization = useRecoilValue(authorizationState);

  return (description: string): Promise<string> =>
    getGeneratedOutputContent({ description }, authorization).then(
      (output) => output.shortDescription || '',
    );
};

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
