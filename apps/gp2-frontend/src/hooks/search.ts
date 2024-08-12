import { gp2 } from '@asap-hub/model';
import { searchQueryParam } from '@asap-hub/routing';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDebounce } from 'use-debounce';
import { usePaginationParams } from './pagination';
import history from '../history';

type Filter = {
  filter?: string[];
} & gp2.FetchProjectFilter &
  gp2.FetchTagSearchFilter &
  gp2.FetchUsersSearchFilter &
  gp2.FetchOutputSearchFilter &
  gp2.FetchEventSearchFilter &
  gp2.FetchNewsFilter;

export const useSearch = (filterNames: (keyof Filter)[] = ['filter']) => {
  const [currentUrlParams] = useSearchParams();
  const navigate = useNavigate();

  const { resetPagination } = usePaginationParams();

  const filters = filterNames.reduce(
    (filterObject, filterName) => ({
      ...filterObject,
      [filterName]: currentUrlParams.getAll(filterName),
    }),
    {} as Filter,
  );

  const replaceArrayParams = (paramName: string, values: string[]) => {
    const newUrlParams = new URLSearchParams(history.location.search);
    newUrlParams.delete(paramName);
    values.forEach((v) => newUrlParams.append(paramName, v));
    navigate(
      {
        search: newUrlParams.toString(),
      },
      { replace: true },
    );
  };

  const tags = currentUrlParams.getAll('tag');
  const setTags = (newTags: string[]) => {
    resetPagination();
    replaceArrayParams('tag', newTags);
  };

  const searchQuery = currentUrlParams.get(searchQueryParam) || '';

  const toggleFilter = (filter: string, filterName: keyof Filter) => {
    resetPagination();
    const newUrlParams = new URLSearchParams(history.location.search);
    newUrlParams.delete(filterName);

    const currentFilters = currentUrlParams.getAll(filterName);
    const filterIndex = currentFilters.indexOf(filter);
    filterIndex > -1
      ? currentFilters.splice(filterIndex, 1)
      : currentFilters.push(filter);
    currentFilters.forEach((f) => newUrlParams.append(filterName, f));
    navigate(
      {
        search: newUrlParams.toString(),
      },
      { replace: true },
    );
  };

  const changeLocation = (pathname: string) => {
    navigate({ pathname, search: currentUrlParams.toString() });
  };

  const updateFilters = (pathname: string, updatedFilters: Filter) => {
    resetPagination();

    const newUrlParams = new URLSearchParams(history.location.search);

    filterNames.forEach((filterName) => {
      newUrlParams.delete(filterName);

      updatedFilters[filterName]?.forEach((filter) => {
        newUrlParams.append(filterName, filter);
      });
    });

    navigate({ pathname, search: newUrlParams.toString() });
  };

  const setSearchQuery = (newSearchQuery: string) => {
    resetPagination();

    const newUrlParams = new URLSearchParams(history.location.search);
    newSearchQuery
      ? newUrlParams.set(searchQueryParam, newSearchQuery)
      : newUrlParams.delete(searchQueryParam);

    navigate(
      {
        search: newUrlParams.toString(),
      },
      { replace: true },
    );
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
