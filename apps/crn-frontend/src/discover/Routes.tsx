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

const Guides = lazy(loadGuides);
const Tutorials = lazy(loadTutorials);
const WorkingGroups = lazy(loadWorkingGroups);

const Discover: FC<Record<string, never>> = () => {
  useEffect(() => {
    loadGuides().then(loadTutorials).then(loadWorkingGroups);
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
        <Redirect to={discover({}).guides({}).$} />
      </Switch>
    </DiscoverPage>
  );
};

export default Discover;
