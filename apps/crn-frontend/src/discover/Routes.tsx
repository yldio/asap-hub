import {
  SkeletonBodyFrame as Frame,
  SearchFrame,
} from '@asap-hub/frontend-utils';
import { DiscoverPage, TutorialsPage } from '@asap-hub/react-components';
import { discoverRoutes } from '@asap-hub/routing';
import { FC, lazy, useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useSearch } from '../hooks';

const loadGuides = () =>
  import(/* webpackChunkName: "discover-guides" */ './Guides');

const loadTutorialList = () =>
  import(
    /* webpackChunkName: "discover-tutorials" */ './tutorials/TutorialList'
  );
const loadTutorialPage = () =>
  import(
    /* webpackChunkName: "tutorials-details-page" */ './tutorials/Tutorial'
  );

const Guides = lazy(loadGuides);
const TutorialList = lazy(loadTutorialList);
const TutorialPage = lazy(loadTutorialPage);

const Discover: FC<Record<string, never>> = () => {
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    loadGuides().then(loadTutorialList).then(loadTutorialPage);
  }, []);

  const { searchQuery, debouncedSearchQuery, setSearchQuery } = useSearch();

  return (
    <Routes>
      <Route
        path={discoverRoutes.DEFAULT.$.GUIDES.relativePath}
        element={
          <Frame title="Guides">
            <DiscoverPage>
              <Guides />
            </DiscoverPage>
          </Frame>
        }
      />

      <Route
        path={discoverRoutes.DEFAULT.$.TUTORIALS.relativePath}
        element={
          <DiscoverPage>
            <TutorialsPage
              searchQuery={searchQuery}
              onSearchQueryChange={setSearchQuery}
            >
              <SearchFrame title="Tutorials">
                <TutorialList searchQuery={debouncedSearchQuery} />
              </SearchFrame>
            </TutorialsPage>
          </DiscoverPage>
        }
      />

      <Route
        path={discoverRoutes.DEFAULT.$.TUTORIALS.DETAILS.relativePath}
        element={
          <Frame title={null}>
            <TutorialPage />
          </Frame>
        }
      />

      {/* TODO: Check if this is right */}
      <Route
        path="*"
        element={<Navigate to={discoverRoutes.DEFAULT.$.GUIDES.relativePath} />}
      />
    </Routes>
  );
};

export default Discover;
