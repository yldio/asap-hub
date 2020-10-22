import React, { useEffect } from 'react';
import { Router, Switch, Route } from 'react-router-dom';
import {
  Layout,
  BasicLayout,
  NotFoundPage,
  createMailTo,
} from '@asap-hub/react-components';
import { useAuth0, useCurrentUser } from '@asap-hub/react-context';

import history from './history';
import { AuthProvider, CheckAuth, Logout } from './auth';
import ErrorBoundary from './errors/ErrorBoundary';

const loadNewsAndEvents = () =>
  import(/* webpackChunkName: "news-and-events" */ './news/Routes');
const loadNetwork = () =>
  import(/* webpackChunkName: "network" */ './network/Routes');
const loadLibrary = () =>
  import(/* webpackChunkName: "library" */ './library/Routes');
const loadHome = () => import(/* webpackChunkName: "home" */ './home/Home');
const loadWelcome = () =>
  import(/* webpackChunkName: "welcome" */ './welcome/Routes');
const loadContent = () =>
  import(/* webpackChunkName: "content" */ './pages/Content');
const loadDiscover = () =>
  import(/* webpackChunkName: "discover" */ './discover/Discover');
const loadAdmin = () => import(/* webpackChunkName: "admin" */ './admin/Admin');
const NewsAndEvents = React.lazy(loadNewsAndEvents);
const Network = React.lazy(loadNetwork);
const Library = React.lazy(loadLibrary);
const Home = React.lazy(loadHome);
const Welcome = React.lazy(loadWelcome);
const Content = React.lazy(loadContent);
const Admin = React.lazy(loadAdmin);
const Discover = React.lazy(loadDiscover);

const Prefetch: React.FC<{}> = () => {
  useEffect(() => {
    loadHome()
      .then(loadNewsAndEvents)
      .then(loadNetwork)
      .then(loadLibrary)
      .then(loadDiscover);
  }, []);
  return null;
};

const ConfiguredLayout: React.FC = ({ children }) => {
  const { isAuthenticated } = useAuth0();
  const user = useCurrentUser();
  return isAuthenticated && user ? (
    <Layout
      discoverAsapHref="/discover"
      libraryHref="/library"
      networkHref="/network"
      newsAndEventsHref="/news-and-events"
      profileHref={`/network/users/${user.id}`}
      teams={user.teams.map(({ id, displayName }) => ({
        name: displayName,
        href: `/network/teams/${id}`,
      }))}
      settingsHref="/settings"
      feedbackHref={createMailTo('info@asap.science', {
        subject: 'Hub Feedback',
      })}
      logoutHref="/logout"
      termsHref="/terms-and-conditions"
      privacyPolicyHref="/privacy-policy"
      aboutHref="https://www.parkinsonsroadmap.org/"
    >
      {children}
    </Layout>
  ) : (
    <BasicLayout>{children}</BasicLayout>
  );
};

const App: React.FC<{}> = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router history={history}>
          <ErrorBoundary>
            <React.Suspense fallback="Loading...">
              <Switch>
                <Route path="/welcome">
                  <Welcome />
                </Route>

                <Route exact path="/terms-and-conditions">
                  <Content layoutComponent={ConfiguredLayout} />
                </Route>
                <Route exact path="/privacy-policy">
                  <Content layoutComponent={ConfiguredLayout} />
                </Route>

                <Route exact path="/admin">
                  <Admin />
                </Route>

                <Route>
                  <CheckAuth>
                    <ConfiguredLayout>
                      <ErrorBoundary>
                        <React.Suspense fallback="Loading...">
                          <Prefetch />
                          <Switch>
                            <Route exact path="/">
                              <Home />
                            </Route>
                            <Route path="/logout">
                              <Logout />
                            </Route>
                            <Route path="/discover">
                              <Discover />
                            </Route>
                            <Route path="/news-and-events">
                              <NewsAndEvents />
                            </Route>
                            <Route path="/network">
                              <Network />
                            </Route>
                            <Route path="/library">
                              <Library />
                            </Route>
                            <Route>
                              <NotFoundPage />
                            </Route>
                          </Switch>
                        </React.Suspense>
                      </ErrorBoundary>
                    </ConfiguredLayout>
                  </CheckAuth>
                </Route>
              </Switch>
            </React.Suspense>
          </ErrorBoundary>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;
