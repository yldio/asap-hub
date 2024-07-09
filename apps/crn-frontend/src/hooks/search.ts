import { useNavigate, useSearchParams } from 'react-router-dom';
import { searchQueryParam } from '@asap-hub/routing';
import { useDebounce } from 'use-debounce';
import { usePaginationParams } from './pagination';

export const useSearch = () => {
  // const currentUrlParams = new URLSearchParams(useLocation().search);
  const [searchParams, setSearchParams] = useSearchParams();
  const history = useNavigate();

  const { resetPagination } = usePaginationParams();

  const filters = new Set<string>(searchParams.getAll('filter'));
  const tags = searchParams.getAll('tag');
  const searchQuery = searchParams.get(searchQueryParam) || '';

  const toggleFilter = (filter: string) => {
    resetPagination();
    const currentFilters = searchParams.getAll('filter');
    const filterIndex = currentFilters.indexOf(filter);
    filterIndex > -1
      ? currentFilters.splice(filterIndex, 1)
      : currentFilters.push(filter);
    replaceArrayParams('filter', currentFilters);
  };

  const setTags = (newTags: string[]) => {
    resetPagination();
    replaceArrayParams('tag', newTags);
  };

  const replaceArrayParams = (paramName: string, values: string[]) => {
    const newUrlParams = new URLSearchParams(searchParams);
    newUrlParams.delete(paramName);
    values.forEach((v) => newUrlParams.append(paramName, v));
    setSearchParams(newUrlParams);
    // history.replace({ search: newUrlParams.toString() });
  };

  const setSearchQuery = (newSearchQuery: string) => {
    resetPagination();

    const newUrlParams = new URLSearchParams(searchParams);
    newSearchQuery
      ? newUrlParams.set(searchQueryParam, newSearchQuery)
      : newUrlParams.delete(searchQueryParam);

    setSearchParams(newUrlParams);
    // history.replace({ search: newUrlParams.toString() });
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
