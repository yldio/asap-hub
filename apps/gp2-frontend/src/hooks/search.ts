import { gp2 } from '@asap-hub/model';
import { searchQueryParam } from '@asap-hub/routing';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDebounce } from 'use-debounce';
import { usePaginationParams } from './pagination';

type Filter = {
  filter?: string[];
} & gp2.FetchProjectFilter &
  gp2.FetchTagSearchFilter &
  gp2.FetchUsersSearchFilter &
  gp2.FetchOutputSearchFilter &
  gp2.FetchEventSearchFilter &
  gp2.FetchNewsFilter;

export const useSearch = (filterNames: (keyof Filter)[] = ['filter']) => {
  const location = useLocation();
  const currentUrlParams = new URLSearchParams(location.search);
  const navigate = useNavigate();

  // not used
  // const { resetPagination } = usePaginationParams();

  const filters = filterNames.reduce(
    (filterObject, filterName) => ({
      ...filterObject,
      [filterName]: currentUrlParams.getAll(filterName),
    }),
    {} as Filter,
  );

  // not used
  // const replaceArrayParams = (paramName: string, values: string[]) => {
  //   const newUrlParams = new URLSearchParams(location.search);
  //   newUrlParams.delete(paramName);
  //   values.forEach((v) => newUrlParams.append(paramName, v));
  //   navigate({ search: newUrlParams.toString() } as never, { replace: true });
  // };

  const tags = currentUrlParams.getAll('tag');
  const setTags = (newTags: string[]) => {
    const newUrlParams = new URLSearchParams(location.search);
    newUrlParams.delete('tag');
    newUrlParams.delete('currentPage');
    newTags.forEach((v) => newUrlParams.append('tag', v));
    navigate({ search: newUrlParams.toString() } as never, { replace: true });
  };

  const searchQuery = currentUrlParams.get(searchQueryParam) || '';

  const toggleFilter = (filter: string, filterName: keyof Filter) => {
    const newUrlParams = new URLSearchParams(location.search);
    newUrlParams.delete(filterName);
    newUrlParams.delete('currentPage');

    const currentFilters = currentUrlParams.getAll(filterName);
    const filterIndex = currentFilters.indexOf(filter);
    filterIndex > -1
      ? currentFilters.splice(filterIndex, 1)
      : currentFilters.push(filter);
    currentFilters.forEach((f) => newUrlParams.append(filterName, f));
    navigate({ search: newUrlParams.toString() } as never, { replace: true });
  };

  const changeLocation = (pathname: string) => {
    navigate({ pathname, search: currentUrlParams.toString() } as never);
  };

  const updateFilters = (pathname: string, updatedFilters: Filter) => {
    const newUrlParams = new URLSearchParams(location.search);
    newUrlParams.delete('currentPage');

    filterNames.forEach((filterName) => {
      newUrlParams.delete(filterName);

      updatedFilters[filterName]?.forEach((filter) => {
        newUrlParams.append(filterName, filter);
      });
    });

    navigate({ pathname, search: newUrlParams.toString() } as never);
  };

  const setSearchQuery = (newSearchQuery: string) => {
    const newUrlParams = new URLSearchParams(location.search);
    newSearchQuery
      ? newUrlParams.set(searchQueryParam, newSearchQuery)
      : newUrlParams.delete(searchQueryParam);
    newUrlParams.delete('currentPage');

    navigate({ search: newUrlParams.toString() } as never, { replace: true });
  };

  const [debouncedSearchQuery] = useDebounce(searchQuery, 400);

  return {
    searchQuery,
    debouncedSearchQuery,
    setSearchQuery,
    filters,
    toggleFilter,
    updateFilters,
    changeLocation,
    tags,
    setTags,
  };
};
