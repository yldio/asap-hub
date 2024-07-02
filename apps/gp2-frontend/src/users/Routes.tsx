import { UsersPage } from '@asap-hub/gp2-components';
import { NotFoundPage } from '@asap-hub/react-components';
import { gp2 } from '@asap-hub/routing';
import { lazy, useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Frame from '../Frame';

const loadUserDirectory = () =>
  import(/* webpackChunkName: "user-directory" */ './UserDirectory');
const loadUserDetail = () =>
  import(/* webpackChunkName: "user-detail" */ './UserDetail');

const UserDetail = lazy(loadUserDetail);
const UserDirectory = lazy(loadUserDirectory);

const { users } = gp2;
const UserRoutes: React.FC<Record<string, never>> = () => {
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    loadUserDirectory().then(loadUserDetail);
  }, []);
  // const { path } = useMatch();
  const [currentTime] = useState(new Date());
  console.log('in routes');

  return (
    <Routes>
      <Route
        path={users.DEFAULT.$.LIST.relativePath}
        element={
          <UsersPage>
            <Frame title="Users">
              <UserDirectory />
            </Frame>
          </UsersPage>
        }
      />
      <Route
        path={users.DEFAULT.$.FILTERS.relativePath}
        element={
          <UsersPage>
            <Frame title="Users Display Filters">
              <UserDirectory displayFilters />
            </Frame>
          </UsersPage>
        }
      />
      <Route
        path={users.DEFAULT.$.DETAILS.relativePath}
        element={<UserDetail currentTime={currentTime} />}
      />

      <Route path={'*'} element={<NotFoundPage />} />
    </Routes>
  );
};

export default UserRoutes;
