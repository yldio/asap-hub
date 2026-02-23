import { SearchFrame } from '@asap-hub/frontend-utils';
import { Loading, SharedResearchPage } from '@asap-hub/react-components';
import { sharedResearch } from '@asap-hub/routing';
import { FC, Suspense, lazy, useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router';

import { useSearch } from '../hooks';

const loadResearchOutputList = () =>
  import(
    /* webpackChunkName: "shared-research-output-list" */ './ResearchOutputList'
  );
const loadResearchOutput = () =>
  import(/* webpackChunkName: "shared-research-output" */ './ResearchOutput');

const ResearchOutputList = lazy(loadResearchOutputList);
const ResearchOutput = lazy(loadResearchOutput);

const SharedResearch: FC<Record<string, never>> = () => {
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    loadResearchOutputList().then(loadResearchOutput);
  }, []);

  const {
    filters,
    searchQuery,
    toggleFilter,
    setSearchQuery,
    debouncedSearchQuery,
  } = useSearch();

  const { pathname } = useLocation();

  return (
    <Suspense key={pathname} fallback={<Loading />}>
      <Routes>
        <Route
          index
          element={
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
          }
        />
        <Route
          path={`${sharedResearch({}).researchOutput.template}/*`}
          element={<ResearchOutput />}
        />
      </Routes>
    </Suspense>
  );
};

export default SharedResearch;
