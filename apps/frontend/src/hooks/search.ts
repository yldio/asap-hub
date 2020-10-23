import { useHistory, useLocation } from 'react-router-dom';

export const useSearch = () => {
  const currentUrlParams = new URLSearchParams(useLocation().search);
  const history = useHistory();
  const filters = new Set<string>(currentUrlParams.getAll('filter'));
  const searchQuery = currentUrlParams.get('searchQuery') || undefined;

  const setFilter = (filter: string) => {
    currentUrlParams.delete('filter');
    filters.has(filter) ? filters.delete(filter) : filters.add(filter);
    filters.forEach((f) => currentUrlParams.append('filter', f));
    history.replace({ search: currentUrlParams.toString() });
  };

  const setSearchQuery = (newSearchQuery: string) => {
    newSearchQuery
      ? currentUrlParams.set('searchQuery', newSearchQuery)
      : currentUrlParams.delete('searchQuery');
    history.replace({ search: currentUrlParams.toString() });
  };
  return { setSearchQuery, setFilter, searchQuery, filters };
};
