import {
  SkeletonBodyFrame as Frame,
  SearchFrame,
} from '@asap-hub/frontend-utils';
import { DiscoverPage, TutorialsPage } from '@asap-hub/react-components';
import { discover } from '@asap-hub/routing';
import { FC, lazy, useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
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

  const { pathname: path } = useLocation();
  const { searchQuery, debouncedSearchQuery, setSearchQuery } = useSearch();

  return (
    <Routes>
      <Route
        path={
          path +
          discover({}).tutorials.template +
          discover({}).tutorials({}).tutorial.template
        }
        element={
          <Frame title={null}>
            <TutorialPage />
          </Frame>
        }
      />

      <DiscoverPage>
        <Routes>
          <Route
            path={path + discover({}).guides.template}
            element={
              <Frame title="Guides">
                <Guides />
              </Frame>
            }
          />

          <Route
            path={path + discover({}).tutorials.template}
            element={
              <TutorialsPage
                searchQuery={searchQuery}
                onSearchQueryChange={setSearchQuery}
              >
                <SearchFrame title="Tutorials">
                  <TutorialList searchQuery={debouncedSearchQuery} />
                </SearchFrame>
              </TutorialsPage>
            }
          />
          <Route
            path="*"
            element={<Navigate to={discover({}).guides({}).$} />}
          />
        </Routes>
      </DiscoverPage>
    </Routes>
  );
};

export default Discover;
