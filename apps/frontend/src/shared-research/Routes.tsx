import React from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import { SharedResearchPage } from '@asap-hub/react-components';
import { useDebounce } from 'use-debounce';

import List from './List';
import ResearchOutput from './ResearchOutput';
import ErrorBoundary from '../errors/ErrorBoundary';
import { useSearch } from '../hooks';

const SharedResearch: React.FC<{}> = () => {
  const { path } = useRouteMatch();
  const { filters, searchQuery, toggleFilter, setSearchQuery } = useSearch();
  const [searchQueryDebounce] = useDebounce(searchQuery, 400);

  return (
    <Switch>
      <Route exact path={`${path}`}>
        <SharedResearchPage
          onChangeSearch={setSearchQuery}
          searchQuery={searchQuery}
          onChangeFilter={toggleFilter}
          filters={filters}
        >
          <ErrorBoundary>
            <List searchQuery={searchQueryDebounce} filters={filters} />
          </ErrorBoundary>
        </SharedResearchPage>
      </Route>
      <Route path={`${path}/:id`}>
        <ResearchOutput />
      </Route>
    </Switch>
  );
};

export default SharedResearch;
