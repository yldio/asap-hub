import { NotFoundPage } from '@asap-hub/react-components';
import { gp2 } from '@asap-hub/routing';
import { lazy, useEffect } from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import WorkingGroupDetail from './WorkingGroupDetail';

const loadWorkingGroups = () =>
  import(/* webpackChunkName: "working-groups-list" */ './WorkingGroups');

const WorkingGroups = lazy(loadWorkingGroups);
const { workingGroups } = gp2;
const Routes: React.FC<Record<string, never>> = () => {
  useEffect(() => {
    loadWorkingGroups();
  }, []);
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route exact path={path}>
        <WorkingGroups />
      </Route>
      <Route component={NotFoundPage} />
      <Route path={path + workingGroups({}).workingGroup.template}>
        <WorkingGroupDetail />
      </Route>
    </Switch>
  );
};

export default Routes;
