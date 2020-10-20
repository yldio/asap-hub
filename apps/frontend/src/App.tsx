import React, { useEffect } from 'react';
import { Router, Switch, Route } from 'react-router-dom';
import { Layout, BasicLayout, NotFoundPage } from '@asap-hub/react-components';
import { useAuth0, useCurrentUser } from '@asap-hub/react-context';

import history from './history';
import { AuthProvider, CheckAuth, Logout } from './auth';

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
    loadNetwork();
    loadLibrary();
    loadNewsAndEvents();
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
      feedbackHref="/feedback"
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
    <AuthProvider>
      <Router history={history}>
        <React.Suspense fallback="Loading...">
          <Switch>
            <Route path="/welcome" component={Welcome} />

            <Route exact path="/terms-and-conditions">
              <Content layoutComponent={ConfiguredLayout} />
            </Route>
            <Route exact path="/privacy-policy">
              <Content layoutComponent={ConfiguredLayout} />
            </Route>

            <Route exact path="/admin" component={Admin} />

            <Route>
              <CheckAuth>
                <ConfiguredLayout>
                  <React.Suspense fallback="Loading...">
                    <Prefetch />
                    <Switch>
                      <Route exact path="/" component={Home} />
                      <Route path="/logout" component={Logout} />

                      <Route
                        path="/news-and-events"
                        component={NewsAndEvents}
                      />
                      <Route path="/discover" component={Discover} />
                      <Route path="/network" component={Network} />
                      <Route path="/library" component={Library} />

                      <Route component={NotFoundPage} />
                    </Switch>
                  </React.Suspense>
                </ConfiguredLayout>
              </CheckAuth>
            </Route>
          </Switch>
        </React.Suspense>
      </Router>
    </AuthProvider>
  );
};

export default App;
