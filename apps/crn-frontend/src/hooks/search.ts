import { useHistory, useLocation } from 'react-router-dom';
import { searchQueryParam } from '@asap-hub/routing';
import { useDebounce } from 'use-debounce';
import { usePaginationParams } from './pagination';

const tupleToParam = ([key, value]: [string, string]) =>
  [encodeURIComponent(key), encodeURIComponent(value)].join(':');
const paramToTuple = (param: string): [string, string] => {
  const tuple = param.split(':');
  if (tuple.length === 2) {
    return [
      decodeURIComponent(tuple[0] ?? ''),
      decodeURIComponent(tuple[1] ?? ''),
    ];
  }
  throw new Error(`Invalid tag param: ${param}`);
};

export const useSearch = () => {
  const currentUrlParams = new URLSearchParams(useLocation().search);
  const history = useHistory();

  const { resetPagination } = usePaginationParams();

  const filters = new Set<string>(currentUrlParams.getAll('filter'));
  const tags = currentUrlParams.getAll('tag').map(paramToTuple);
  const searchQuery = currentUrlParams.get(searchQueryParam) || '';

  const toggleFilter = (filter: string) => {
    resetPagination();
    const currentFilters = currentUrlParams.getAll('filter');
    const filterIndex = currentFilters.indexOf(filter);
    filterIndex > -1
      ? currentFilters.splice(filterIndex, 1)
      : currentFilters.push(filter);
    replaceArrayParams('filter', currentFilters);
  };

  const setTags = (newTags: [string, string][]) => {
    resetPagination();
    replaceArrayParams('tag', newTags.map(tupleToParam));
  };

  const replaceArrayParams = (paramName: string, values: string[]) => {
    const newUrlParams = new URLSearchParams(history.location.search);
    newUrlParams.delete(paramName);
    values.forEach((v) => newUrlParams.append(paramName, v));
    history.replace({ search: newUrlParams.toString() });
  };

  const setSearchQuery = (newSearchQuery: string) => {
    resetPagination();

    const newUrlParams = new URLSearchParams(history.location.search);
    newSearchQuery
      ? newUrlParams.set(searchQueryParam, newSearchQuery)
      : newUrlParams.delete(searchQueryParam);

    history.replace({ search: newUrlParams.toString() });
  };

  const [debouncedSearchQuery] = useDebounce(searchQuery, 400);

  return {
    searchQuery,
    debouncedSearchQuery,
    setSearchQuery,
    filters,
    toggleFilter,
    tags,
    setTags,
  };
};
