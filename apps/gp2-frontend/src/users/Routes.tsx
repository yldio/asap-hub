import { NotFoundPage } from '@asap-hub/react-components';
import { gp2 } from '@asap-hub/routing';
import { lazy, useEffect } from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import UserDirectory from './UserDirectory';

const loadUserDetail = () =>
  import(/* webpackChunkName: "user-detail" */ './UserDetail');

const UserDetail = lazy(loadUserDetail);

const { users } = gp2;
const Routes: React.FC<Record<string, never>> = () => {
  useEffect(() => {
    loadUserDetail();
  }, []);
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route exact path={path}>
        <UserDirectory />
      </Route>
      <Route exact path={users({}).filters({}).$}>
        <UserDirectory displayFilters />
      </Route>
      <Route path={path + users({}).user.template}>
        <UserDetail />
      </Route>
      <Route component={NotFoundPage} />
    </Switch>
  );
};

export default Routes;
