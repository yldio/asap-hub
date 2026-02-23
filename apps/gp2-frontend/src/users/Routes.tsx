import { UsersPage } from '@asap-hub/gp2-components';
import { Loading, NotFoundPage } from '@asap-hub/react-components';
import { gp2 } from '@asap-hub/routing';
import { Suspense, lazy, useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router';
import Frame from '../Frame';

const loadUserDirectory = () =>
  import(/* webpackChunkName: "user-directory" */ './UserDirectory');
const loadUserDetail = () =>
  import(/* webpackChunkName: "user-detail" */ './UserDetail');

const UserDetail = lazy(loadUserDetail);
const UserDirectory = lazy(loadUserDirectory);

const { users } = gp2;
const RoutesComponent: React.FC<Record<string, never>> = () => {
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    loadUserDirectory().then(loadUserDetail);
  }, []);
  const [currentTime] = useState(new Date());
  const { pathname, search } = useLocation();
  const params = new URLSearchParams(search);
  params.delete('searchQuery');
  const frameKey = params.toString();

  return (
    <Suspense key={pathname} fallback={<Loading />}>
      <Routes>
        <Route
          index
          element={
            <UsersPage>
              <Frame key={frameKey} title="Users">
                <UserDirectory />
              </Frame>
            </UsersPage>
          }
        />
        <Route
          path={users({}).filters.template}
          element={
            <UsersPage>
              <Frame key={frameKey} title="Users Display Filters">
                <UserDirectory displayFilters />
              </Frame>
            </UsersPage>
          }
        />
        <Route
          path={`${users({}).user.template}/*`}
          element={<UserDetail currentTime={currentTime} />}
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
};

export default RoutesComponent;
