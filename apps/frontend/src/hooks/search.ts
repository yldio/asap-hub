import { useHistory, useLocation } from 'react-router-dom';
import { searchQueryParam } from '@asap-hub/routing';
import { useDebounce } from 'use-debounce';
import { usePaginationParams } from './pagination';

export const useSearch = () => {
  const currentUrlParams = new URLSearchParams(useLocation().search);
  const history = useHistory();

  const { resetPagination } = usePaginationParams();

  const filters = new Set<string>(currentUrlParams.getAll('filter'));
  const searchQuery = currentUrlParams.get(searchQueryParam) || '';

  const toggleFilter = (filter: string) => {
    resetPagination();
    const newUrlParams = new URLSearchParams(history.location.search);
    newUrlParams.delete('filter');

    const currentFilters = currentUrlParams.getAll('filter');
    const filterIndex = currentFilters.indexOf(filter);
    filterIndex > -1
      ? currentFilters.splice(filterIndex, 1)
      : currentFilters.push(filter);
    currentFilters.forEach((f) => newUrlParams.append('filter', f));
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
  };
};
