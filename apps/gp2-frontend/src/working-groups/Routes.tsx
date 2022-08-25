import { NotFoundPage } from '@asap-hub/react-components';
import { gp2 } from '@asap-hub/routing';
import { lazy, useEffect } from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';

const loadWorkingGroups = () =>
  import(/* webpackChunkName: "working-groups-list" */ './WorkingGroups');
const loadWorkingGroupDetail = () =>
  import(
    /* webpackChunkName: "working-groups-detail" */ './WorkingGroupDetail'
  );

const WorkingGroups = lazy(loadWorkingGroups);
const WorkingGroupDetail = lazy(loadWorkingGroupDetail);

const { workingGroups } = gp2;
const Routes: React.FC<Record<string, never>> = () => {
  useEffect(() => {
    loadWorkingGroups().then(loadWorkingGroupDetail);
  }, []);
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route exact path={path}>
        <WorkingGroups />
      </Route>
      <Route path={path + workingGroups({}).workingGroup.template}>
        <WorkingGroupDetail />
      </Route>
      <Route component={NotFoundPage} />
    </Switch>
  );
};

export default Routes;
