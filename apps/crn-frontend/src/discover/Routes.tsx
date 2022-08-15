import { FC, lazy, useEffect } from 'react';
import { Switch, Route, useRouteMatch, Redirect } from 'react-router-dom';
import { Frame } from '@asap-hub/frontend-utils';
import { discover } from '@asap-hub/routing';
import { DiscoverPage } from '@asap-hub/react-components';

const loadGuides = () =>
  import(/* webpackChunkName: "discover-guides" */ './Guides');

const loadTutorials = () =>
  import(/* webpackChunkName: "discover-tutorials" */ './Tutorials');

const loadWorkingGroups = () =>
  import(/* webpackChunkName: "discover-working-groups" */ './WorkingGroups');

const loadAbout = () =>
  import(/* webpackChunkName: "discover-about" */ './About');

const Guides = lazy(loadGuides);
const Tutorials = lazy(loadTutorials);
const WorkingGroups = lazy(loadWorkingGroups);
const About = lazy(loadAbout);

const Discover: FC<Record<string, never>> = () => {
  useEffect(() => {
    loadGuides().then(loadTutorials).then(loadWorkingGroups).then(loadAbout);
  }, []);

  const { path } = useRouteMatch();

  return (
    <DiscoverPage>
      <Switch>
        <Route exact path={path + discover({}).guides.template}>
          <Frame title="Guides">
            <Guides />
          </Frame>
        </Route>
        <Route exact path={path + discover({}).tutorials.template}>
          <Frame title="Tutorials">
            <Tutorials />
          </Frame>
        </Route>
        <Route exact path={path + discover({}).workingGroups.template}>
          <Frame title="Working Groups">
            <WorkingGroups />
          </Frame>
        </Route>
        <Route exact path={path + discover({}).about.template}>
          <Frame title="About ASAP">
            <About />
          </Frame>
        </Route>
        <Redirect to={discover({}).guides({}).$} />
      </Switch>
    </DiscoverPage>
  );
};

export default Discover;
