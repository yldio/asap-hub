import React from 'react';
import {
  Switch,
  Route,
  useRouteMatch,
  useHistory,
  useLocation,
} from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import { LibraryPage, ErrorCard } from '@asap-hub/react-components';
import { useDebounce } from 'use-debounce';

import List from './List';
import ResearchOutput from './ResearchOutput';

const Library: React.FC<{}> = () => {
  const { path } = useRouteMatch();
  const { search } = useLocation();
  const history = useHistory();
  const currentUrlParams = new URLSearchParams(search);
  const filters = new Set(currentUrlParams.getAll('filter'));
  const searchQuery = currentUrlParams.get('searchQuery') || undefined;
  const [searchQueryDebounce] = useDebounce(searchQuery, 500);

  const onChangeSearch = (newQuery: string) => {
    newQuery
      ? currentUrlParams.set('searchQuery', newQuery)
      : currentUrlParams.delete('searchQuery');
    history.replace({ search: currentUrlParams.toString() });
  };
  const onChangeFilter = (filter: string) => {
    currentUrlParams.delete('filter');
    filters.has(filter) ? filters.delete(filter) : filters.add(filter);
    filters.forEach((f) => currentUrlParams.append('filter', f));
    history.replace({ search: currentUrlParams.toString() });
  };

  return (
    <Switch>
      <Route exact path={`${path}`}>
        <LibraryPage
          onChangeSearch={onChangeSearch}
          searchQuery={searchQuery}
          onChangeFilter={onChangeFilter}
          filters={filters}
        >
          <ErrorBoundary FallbackComponent={ErrorCard}>
            <List searchQuery={searchQueryDebounce} filters={filters} />
          </ErrorBoundary>
        </LibraryPage>
      </Route>
      <Route path={`${path}/:id`}>
        <ResearchOutput />
      </Route>
    </Switch>
  );
};

export default Library;
