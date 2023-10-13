import { getEvents } from './events/api';
import { useAlgolia } from './hooks/algolia';
import { getOutputs } from './outputs/api';

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
