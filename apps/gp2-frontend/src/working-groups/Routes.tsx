import { NotFoundPage } from '@asap-hub/react-components';
import { lazy, useEffect } from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';

const loadWorkingGroups = () =>
  import(
    /* webpackChunkName: "shared-research-output-list" */ './WorkingGroups'
  );

const WorkingGroups = lazy(loadWorkingGroups);
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
    </Switch>
  );
};

export default Routes;
