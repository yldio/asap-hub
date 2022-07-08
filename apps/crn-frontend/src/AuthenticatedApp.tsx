import { FC, lazy, useEffect } from 'react';
import { Switch, Route } from 'react-router-dom';
import { useResetRecoilState, useRecoilState } from 'recoil';
import { NotFoundPage, Layout, Loading } from '@asap-hub/react-components';
import { useAuth0, useCurrentUser } from '@asap-hub/react-context';
import {
  network,
  discover,
  sharedResearch,
  news,
  events,
} from '@asap-hub/routing';
import { Frame } from '@asap-hub/frontend-utils';

import { auth0State } from './auth/state';
import CheckOnboarded from './auth/CheckOnboarded';
import Onboardable from './Onboardable';
import { useCurrentUserProfileTabRoute } from './hooks';

const loadNews = () => import(/* webpackChunkName: "news" */ './news/Routes');
const loadNetwork = () =>
  import(/* webpackChunkName: "network" */ './network/Network');
const loadSharedResearch = () =>
  import(/* webpackChunkName: "shared-research" */ './shared-research/Routes');
const loadDashboard = () =>
  import(/* webpackChunkName: "dashboard" */ './dashboard/Dashboard');
const loadDiscover = () =>
  import(/* webpackChunkName: "discover" */ './discover/Routes');
const loadEvents = () =>
  import(/* webpackChunkName: "events" */ './events/Events');
const News = lazy(loadNews);
const Network = lazy(loadNetwork);
const SharedResearch = lazy(loadSharedResearch);
const Dashboard = lazy(loadDashboard);
const Discover = lazy(loadDiscover);
const Events = lazy(loadEvents);

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
    loadDashboard()
      .then(loadNews)
      .then(loadNetwork)
      .then(loadSharedResearch)
      .then(loadDiscover)
      .then(loadEvents);
  }, []);

  const user = useCurrentUser();
  const tabRoute = useCurrentUserProfileTabRoute();
  if (!user || !recoilAuth0) {
    return <Loading />;
  }

  return (
    <Onboardable>
      {(onboardable) => (
        <Layout
          userOnboarded={user.onboarded}
          onboardable={onboardable}
          onboardModalHref={
            tabRoute ? tabRoute({}).editOnboarded({}).$ : undefined
          }
          userProfileHref={network({}).users({}).user({ userId: user.id }).$}
          teams={user.teams.map(({ id, displayName = '' }) => ({
            name: displayName,
            href: network({}).teams({}).team({ teamId: id }).$,
          }))}
          aboutHref="https://www.parkinsonsroadmap.org/"
        >
          <CheckOnboarded>
            <Switch>
              <Route exact path="/">
                <Frame title="Dashboard">
                  <Dashboard />
                </Frame>
              </Route>
              <Route path={discover.template}>
                <Frame title="Discover ASAP">
                  <Discover />
                </Frame>
              </Route>
              <Route path={news.template}>
                <Frame title="News">
                  <News />
                </Frame>
              </Route>
              <Route path={network.template}>
                <Frame title={null}>
                  <Network />
                </Frame>
              </Route>
              <Route path={sharedResearch.template}>
                <Frame title="Shared Research">
                  <SharedResearch />
                </Frame>
              </Route>
              <Route path={events.template}>
                <Frame title={null}>
                  <Events />
                </Frame>
              </Route>
              <Route>
                <Frame title="Not Found">
                  <NotFoundPage />
                </Frame>
              </Route>
            </Switch>
          </CheckOnboarded>
        </Layout>
      )}
    </Onboardable>
  );
};

export default AuthenticatedApp;
