import {
  SkeletonBodyFrame as Frame,
  SearchFrame,
} from '@asap-hub/frontend-utils';
import { DiscoverPage, TutorialsPage } from '@asap-hub/react-components';
import { discover } from '@asap-hub/routing';
import { FC, lazy, useEffect } from 'react';
import { Redirect, Route, Switch, useRouteMatch } from 'react-router-dom';
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

  const { path } = useRouteMatch();
  const { searchQuery, debouncedSearchQuery, setSearchQuery } = useSearch();

  return (
    <Switch>
      <Route
        path={
          path +
          discover({}).tutorials.template +
          discover({}).tutorials({}).tutorial.template
        }
      >
        <Frame title={null}>
          <TutorialPage />
        </Frame>
      </Route>
      <DiscoverPage>
        <Switch>
          <Route exact path={path + discover({}).guides.template}>
            <Frame title="Guides">
              <Guides />
            </Frame>
          </Route>
          <Route exact path={path + discover({}).tutorials.template}>
            <TutorialsPage
              searchQuery={searchQuery}
              onSearchQueryChange={setSearchQuery}
            >
              <SearchFrame title="Tutorials">
                <TutorialList searchQuery={debouncedSearchQuery} />
              </SearchFrame>
            </TutorialsPage>
          </Route>
          <Redirect to={discover({}).guides({}).$} />
        </Switch>
      </DiscoverPage>
    </Switch>
  );
};

export default Discover;
