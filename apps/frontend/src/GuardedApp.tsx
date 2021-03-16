import React, { useEffect } from 'react';
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
const NewsAndEvents = React.lazy(loadNewsAndEvents);
const Network = React.lazy(loadNetwork);
const SharedResearch = React.lazy(loadSharedResearch);
const Dashboard = React.lazy(loadDashboard);
const Discover = React.lazy(loadDiscover);
const Events = React.lazy(loadEvents);

const GuardedApp: React.FC<Record<string, never>> = () => {
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
    <Switch>
      <Route exact path="/">
        <Dashboard />
      </Route>
      <Route path={logout.template}>
        <Logout />
      </Route>
      <Route path={discover.template}>
        <Discover />
      </Route>
      <Route path={news.template}>
        <NewsAndEvents />
      </Route>
      <Route path={network.template}>
        <Network />
      </Route>
      <Route path={sharedResearch.template}>
        <SharedResearch />
      </Route>
      <Route path={events.template}>
        <Events />
      </Route>
      <Route>
        <NotFoundPage />
      </Route>
    </Switch>
  );
};

const GuardedAppWithRecoil: React.FC<Record<string, never>> = () => (
  <RecoilRoot>
    <GuardedApp />
  </RecoilRoot>
);

export default GuardedAppWithRecoil;
