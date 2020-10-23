import React from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import { LibraryPage } from '@asap-hub/react-components';
import { useDebounce } from 'use-debounce';

import List from './List';
import ResearchOutput from './ResearchOutput';
import ErrorBoundary from '../errors/ErrorBoundary';
import { useSearch } from '../hooks';

const Library: React.FC<{}> = () => {
  const { path } = useRouteMatch();
  const { filters, searchQuery, setFilter, setSearchQuery } = useSearch();
  const [searchQueryDebounce] = useDebounce(searchQuery, 400);

  return (
    <Switch>
      <Route exact path={`${path}`}>
        <LibraryPage
          onChangeSearch={setSearchQuery}
          searchQuery={searchQuery}
          onChangeFilter={setFilter}
          filters={filters}
        >
          <ErrorBoundary>
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
