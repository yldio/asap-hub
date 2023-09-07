import { FC, lazy, useEffect } from 'react';
import { Switch, Route, useRouteMatch, Redirect } from 'react-router-dom';
import { Frame } from '@asap-hub/frontend-utils';
import { guides, tutorials } from '@asap-hub/routing';
import { DiscoverPage } from '@asap-hub/react-components';

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
    loadGuides().then(loadTutorialList).then(loadTutorialPage);
  }, []);

  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route exact path={tutorials({}).$ + tutorials({}).tutorial}>
        <Frame title={null}>
          <TutorialPage />
        </Frame>
      </Route>
      <DiscoverPage>
        <Switch>
          <Route path={guides({}).$}>
            <Frame title="Guides">
              <Guides />
            </Frame>
          </Route>
          <Route path={tutorials({}).$}>
            <Frame title="Tutorials">
              <TutorialList />
            </Frame>
          </Route>
          <Redirect to={guides({}).$} />
        </Switch>
      </DiscoverPage>
    </Switch>
  );
};

export default Discover;
