import React, { useEffect } from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import { SharedResearchPage } from '@asap-hub/react-components';
import { useDebounce } from 'use-debounce';

import { useSearch } from '../hooks';
import { SearchFrame } from '../structure/Frame';

const loadResearchOutputList = () =>
  import(
    /* webpackChunkName: "shared-research-output-list" */ './ResearchOutputList'
  );
const loadResearchOutput = () =>
  import(/* webpackChunkName: "shared-research-output" */ './ResearchOutput');
const ResearchOutputList = React.lazy(loadResearchOutputList);
const ResearchOutput = React.lazy(loadResearchOutput);
loadResearchOutputList();

const SharedResearch: React.FC<Record<string, never>> = () => {
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
          <SearchFrame>
            <ResearchOutputList
              searchQuery={searchQueryDebounce}
              filters={filters}
            />
          </SearchFrame>
        </SharedResearchPage>
      </Route>
      <Route path={`${path}/:id`}>
        <ResearchOutput />
      </Route>
    </Switch>
  );
};

export default SharedResearch;
