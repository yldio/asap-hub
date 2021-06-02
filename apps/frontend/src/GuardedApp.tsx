import { FC, lazy, useEffect } from 'react';
import { Switch, Route } from 'react-router-dom';
import { useSetRecoilState, RecoilRoot, useResetRecoilState } from 'recoil';
import { NotFoundPage } from '@asap-hub/react-components';
import { useAuth0 } from '@asap-hub/react-context';
import {
  network,
  discover,
  sharedResearch,
  logout,
  news,
  events,
} from '@asap-hub/routing';

import { auth0State } from './auth/state';
import Logout from './auth/Logout';
import Frame from './structure/Frame';
import CheckOnboarded from './auth/CheckOnboarded';

const loadNewsAndEvents = () =>
  import(/* webpackChunkName: "news-and-events" */ './news/Routes');
const loadNetwork = () =>
  import(/* webpackChunkName: "network" */ './network/Network');
const loadSharedResearch = () =>
  import(/* webpackChunkName: "shared-research" */ './shared-research/Routes');
const loadDashboard = () =>
  import(/* webpackChunkName: "dashboard" */ './dashboard/Dashboard');
const loadDiscover = () =>
  import(/* webpackChunkName: "discover" */ './discover/Discover');
const loadEvents = () =>
  import(/* webpackChunkName: "events" */ './events/Events');
const NewsAndEvents = lazy(loadNewsAndEvents);
const Network = lazy(loadNetwork);
const SharedResearch = lazy(loadSharedResearch);
const Dashboard = lazy(loadDashboard);
const Discover = lazy(loadDiscover);
const Events = lazy(loadEvents);

const GuardedApp: FC<Record<string, never>> = () => {
  const auth0 = useAuth0();
  const setAuth0 = useSetRecoilState(auth0State);
  const resetAuth0 = useResetRecoilState(auth0State);
  useEffect(() => {
    setAuth0(auth0);
    return () => resetAuth0();
  }, [auth0, setAuth0, resetAuth0]);

  useEffect(() => {
    // order by the likelyhood of user navigating there
    loadDashboard()
      .then(loadNewsAndEvents)
      .then(loadNetwork)
      .then(loadSharedResearch)
      .then(loadDiscover)
      .then(loadEvents);
  }, []);

  return (
    <CheckOnboarded>
      <Switch>
        <Route exact path="/">
          <Frame title="Dashboard">
            <Dashboard />
          </Frame>
        </Route>
        <Route path={logout.template}>
          <Frame title="Logout">
            <Logout />
          </Frame>
        </Route>
        <Route path={discover.template}>
          <Frame title="Discover ASAP">
            <Discover />
          </Frame>
        </Route>
        <Route path={news.template}>
          <Frame title="News">
            <NewsAndEvents />
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
  );
};

const GuardedAppWithRecoil: FC<Record<string, never>> = () => (
  <RecoilRoot>
    <GuardedApp />
  </RecoilRoot>
);

export default GuardedAppWithRecoil;
