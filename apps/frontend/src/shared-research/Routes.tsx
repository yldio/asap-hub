import React, { useEffect, Suspense } from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import { SharedResearchPage, Loading } from '@asap-hub/react-components';
import { useDebounce } from 'use-debounce';

import ErrorBoundary from '../errors/ErrorBoundary';
import { useSearch } from '../hooks';

const loadResearchOutputList = () =>
  import(
    /* webpackChunkName: "shared-research-output-list" */ './ResearchOutputList'
  );
const loadResearchOutput = () =>
  import(/* webpackChunkName: "shared-research-output" */ './ResearchOutput');
const ResearchOutputList = React.lazy(loadResearchOutputList);
const ResearchOutput = React.lazy(loadResearchOutput);
loadResearchOutputList();

const SharedResearch: React.FC<{}> = () => {
  useEffect(() => {
    loadResearchOutputList().then(loadResearchOutput);
  }, []);

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
            <Suspense fallback={<Loading />}>
              <ResearchOutputList
                searchQuery={searchQueryDebounce}
                filters={filters}
              />
            </Suspense>
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
