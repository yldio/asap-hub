import { useHistory, useLocation } from 'react-router-dom';
import { searchQueryParam } from '@asap-hub/routing';
import { useDebounce } from 'use-debounce';
import { usePaginationParams } from './pagination';

export const useSearch = <TFilter>(filterNames: string[] = ['filter']) => {
  const currentUrlParams = new URLSearchParams(useLocation().search);
  const history = useHistory();

  const { resetPagination } = usePaginationParams();

  const filters = filterNames.reduce(
    (filterObject, filterName) => ({
      ...filterObject,
      [filterName]: currentUrlParams.getAll(filterName),
    }),
    {} as { [x: string]: string[] },
  ) as TFilter;

  const searchQuery = currentUrlParams.get(searchQueryParam) || '';

  const toggleFilter = (filter: string, filterName: string) => {
    resetPagination();
    const newUrlParams = new URLSearchParams(history.location.search);
    newUrlParams.delete(filterName);

    const currentFilters = currentUrlParams.getAll(filterName);
    const filterIndex = currentFilters.indexOf(filter);
    filterIndex > -1
      ? currentFilters.splice(filterIndex, 1)
      : currentFilters.push(filter);
    currentFilters.forEach((f) => newUrlParams.append(filterName, f));
    history.replace({ search: newUrlParams.toString() });
  };

  const updateParams = (search: string) => {
    const newUrlParams = new URLSearchParams(search);
    return {
      newUrlParams,
      updateParams: function update(name: string, items?: string[]) {
        newUrlParams.delete(name);
        items?.forEach((item) => newUrlParams.append(name, item));
        return this;
      },
    };
  };

  const changeLocation = (pathname: string) => {
    history.push({ pathname, search: currentUrlParams.toString() });
  };

  const updateFilters = (pathname: string, filterObj: TFilter) => {
    resetPagination();

    const currentFilters = filterObj as { [x: string]: string[] };

    // const { newUrlParams } = filterNames.reduce((prev, curr) => {
    //   const val = prev.updateParams(curr, filt[curr]);
    //   return val;
    // }, updateParams(history.location.search));

    const { newUrlParams } = filterNames.reduce((prevUrlParams, filterName) => {
      const currentParams = prevUrlParams.updateParams(
        filterName,
        currentFilters[filterName],
      );
      return currentParams;
    }, updateParams(history.location.search));

    history.push({ pathname, search: newUrlParams.toString() });
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
    updateFilters,
    changeLocation,
  };
};
