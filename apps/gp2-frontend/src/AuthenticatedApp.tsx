import { FC, lazy, useEffect } from 'react';
import { Switch, Route } from 'react-router-dom';
import { useResetRecoilState, useRecoilState } from 'recoil';
import { NotFoundPage, Loading } from '@asap-hub/react-components';
import { useAuth0, useCurrentUser } from '@asap-hub/react-context';
import { Layout } from '@asap-hub/gp2-components';
import { network } from '@asap-hub/routing';

import { auth0State } from './auth/state';
import Frame from './structure/Frame';

const loadDashboard = () =>
  import(/* webpackChunkName: "dashboard" */ './dashboard/Dashboard');

const Dashboard = lazy(loadDashboard);

const AuthenticatedApp: FC<Record<string, never>> = () => {
  const auth0 = useAuth0();
  const [recoilAuth0, setAuth0] = useRecoilState(auth0State);
  const resetAuth0 = useResetRecoilState(auth0State);
  useEffect(() => {
    setAuth0(auth0);
    return () => resetAuth0();
  }, [auth0, setAuth0, resetAuth0]);

  useEffect(() => {
    // order by the likelyhood of user navigating there
    loadDashboard();
  }, []);

  const user = useCurrentUser();
  if (!user || !recoilAuth0) {
    return <Loading />;
  }
  return (
    <Layout
      userOnboarded={user.onboarded}
      userProfileHref={network({}).users({}).user({ userId: user.id }).$}
      teams={user.teams.map(({ id, displayName = '' }) => ({
        name: displayName,
        href: network({}).teams({}).team({ teamId: id }).$,
      }))}
      aboutHref="https://www.parkinsonsroadmap.org/"
    >
      <Switch>
        <Route exact path="/">
          <Frame title="Dashboard">
            <Dashboard />
          </Frame>
        </Route>
        <Route>
          <Frame title="Not Found">
            <NotFoundPage />
          </Frame>
        </Route>
      </Switch>
    </Layout>
  );
};

export default AuthenticatedApp;
