import { UsersPage } from '@asap-hub/gp2-components';
import { NotFoundPage } from '@asap-hub/react-components';
import { gp2 } from '@asap-hub/routing';
import { lazy, useEffect, useState } from 'react';
import { Route, Routes, useMatch } from 'react-router-dom';
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
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    loadUserDirectory().then(loadUserDetail);
  }, []);
  const { path } = useMatch();
  const [currentTime] = useState(new Date());

  return (
    <Routes>
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
    </Routes>
  );
};

export default Routes;
