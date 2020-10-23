import { useHistory, useLocation } from 'react-router-dom';
import { usePaginationParams } from './pagination';

export const useSearch = () => {
  const currentUrlParams = new URLSearchParams(useLocation().search);
  const history = useHistory();

  const { resetPagination } = usePaginationParams();

  const filters = new Set<string>(currentUrlParams.getAll('filter'));
  const searchQuery = currentUrlParams.get('searchQuery') || undefined;

  const toggleFilter = (filter: string) => {
    resetPagination();

    const newUrlParams = new URLSearchParams(history.location.search);
    newUrlParams.delete('filter');
    filters.has(filter) ? filters.delete(filter) : filters.add(filter);
    filters.forEach((f) => newUrlParams.append('filter', f));

    history.replace({ search: newUrlParams.toString() });
  };
  const resetFilters = () => {
    resetPagination();

    const newUrlParams = new URLSearchParams(history.location.search);
    newUrlParams.delete('filter');

    history.replace({ search: newUrlParams.toString() });
  };

  const setSearchQuery = (newSearchQuery: string) => {
    resetPagination();

    const newUrlParams = new URLSearchParams(history.location.search);
    newSearchQuery
      ? newUrlParams.set('searchQuery', newSearchQuery)
      : newUrlParams.delete('searchQuery');

    history.replace({ search: newUrlParams.toString() });
  };
  return { setSearchQuery, toggleFilter, resetFilters, searchQuery, filters };
};
