import { UsersPage } from '@asap-hub/gp2-components';
import { NotFoundPage } from '@asap-hub/react-components';
import { gp2 } from '@asap-hub/routing';
import { lazy, useEffect, useState } from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import Frame from '../Frame';

const loadUserDirectory = () =>
  import(/* webpackChunkName: "user-directory" */ './UserDirectory');
const loadUserDetail = () =>
  import(/* webpackChunkName: "user-detail" */ './UserDetail');

const UserDetail = lazy(loadUserDetail);
const UserDirectory = lazy(loadUserDirectory);

const { users } = gp2;
const Routes: React.FC<Record<string, never>> = () => {
  useEffect(() => {
    loadUserDirectory().then(loadUserDetail);
  }, []);
  const { path } = useRouteMatch();
  const [currentTime] = useState(new Date());

  return (
    <Switch>
      <Route exact path={path}>
        <UsersPage>
          <Frame title="Users">
            <UserDirectory />
          </Frame>
        </UsersPage>
      </Route>
      <Route exact path={users({}).filters({}).$}>
        <UsersPage>
          <Frame title="Users Display Filters">
            <UserDirectory displayFilters />
          </Frame>
        </UsersPage>
      </Route>
      <Route path={path + users({}).user.template}>
        <UserDetail currentTime={currentTime} />
      </Route>
      <Route component={NotFoundPage} />
    </Switch>
  );
};

export default Routes;
