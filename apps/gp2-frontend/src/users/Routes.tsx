import { Frame } from '@asap-hub/frontend-utils';
import { UsersPage } from '@asap-hub/gp2-components';
import { NotFoundPage } from '@asap-hub/react-components';
import { gp2 } from '@asap-hub/routing';
import { lazy, useEffect } from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';

const loadUserList = () =>
  import(/* webpackChunkName: "project-list" */ './UserList');
const loadUserDetail = () =>
  import(/* webpackChunkName: "project-detail" */ './UserDetail');

const UserList = lazy(loadUserList);
const UserDetail = lazy(loadUserDetail);

const { users } = gp2;
const Routes: React.FC<Record<string, never>> = () => {
  useEffect(() => {
    loadUserList().then(loadUserDetail);
  }, []);
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route exact path={path}>
        <UsersPage>
          <Frame title="Users">
            <UserList />
          </Frame>
        </UsersPage>
      </Route>
      <Route path={path + users({}).user.template}>
        <UserDetail />
      </Route>
      <Route component={NotFoundPage} />
    </Switch>
  );
};

export default Routes;
