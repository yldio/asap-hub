import React, { useEffect } from 'react';
import { Switch, Route } from 'react-router-dom';
import { useSetRecoilState, RecoilRoot, useResetRecoilState } from 'recoil';
import { NotFoundPage } from '@asap-hub/react-components';
import { useAuth0 } from '@asap-hub/react-context';

import {
  DISCOVER_PATH,
  NETWORK_PATH,
  LOGOUT_PATH,
  NEWS_AND_EVENTS_PATH,
  SHARED_RESEARCH_PATH,
  EVENTS_PATH,
} from './routes';
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
      <Route path={LOGOUT_PATH}>
        <Logout />
      </Route>
      <Route path={DISCOVER_PATH}>
        <Discover />
      </Route>
      <Route path={NEWS_AND_EVENTS_PATH}>
        <NewsAndEvents />
      </Route>
      <Route path={NETWORK_PATH}>
        <Network />
      </Route>
      <Route path={SHARED_RESEARCH_PATH}>
        <SharedResearch />
      </Route>
      <Route path={EVENTS_PATH}>
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
