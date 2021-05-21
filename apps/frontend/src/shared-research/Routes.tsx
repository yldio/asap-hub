import { FC, lazy, useEffect } from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import { SharedResearchPage } from '@asap-hub/react-components';
import { sharedResearch } from '@asap-hub/routing';

import { useSearch } from '../hooks';
import { SearchFrame } from '../structure/Frame';

const loadResearchOutputList = () =>
  import(
    /* webpackChunkName: "shared-research-output-list" */ './ResearchOutputList'
  );
const loadResearchOutput = () =>
  import(/* webpackChunkName: "shared-research-output" */ './ResearchOutput');
const ResearchOutputList = lazy(loadResearchOutputList);
const ResearchOutput = lazy(loadResearchOutput);
loadResearchOutputList();

const SharedResearch: FC<Record<string, never>> = () => {
  useEffect(() => {
    loadResearchOutputList().then(loadResearchOutput);
  }, []);

  const { path } = useRouteMatch();
  const {
    filters,
    searchQuery,
    toggleFilter,
    setSearchQuery,
    debouncedSearchQuery,
  } = useSearch();

  return (
    <Switch>
      <Route exact path={path}>
        <SharedResearchPage
          onChangeSearch={setSearchQuery}
          searchQuery={searchQuery}
          onChangeFilter={toggleFilter}
          filters={filters}
        >
          <SearchFrame title={null}>
            <ResearchOutputList
              searchQuery={debouncedSearchQuery}
              filters={filters}
            />
          </SearchFrame>
        </SharedResearchPage>
      </Route>
      <Route path={path + sharedResearch({}).researchOutput.template}>
        <ResearchOutput />
      </Route>
    </Switch>
  );
};

export default SharedResearch;
