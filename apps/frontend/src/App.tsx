import React, { useEffect } from 'react';
import { Router, Switch, Route } from 'react-router-dom';
import { LastLocationProvider } from 'react-router-last-location';
import {
  Layout,
  BasicLayout,
  GoogleTagManager,
} from '@asap-hub/react-components';
import { useAuth0, useCurrentUser } from '@asap-hub/react-context';
import { staticPages, network, welcome } from '@asap-hub/routing';

import history from './history';
import AuthProvider from './auth/AuthProvider';
import CheckAuth from './auth/CheckAuth';
import Frame from './structure/Frame';
import { GTM_CONTAINER_ID } from './config';

const loadWelcome = () =>
  import(/* webpackChunkName: "welcome" */ './welcome/Routes');
const loadContent = () =>
  import(/* webpackChunkName: "content" */ './content/Content');
const loadGuardedApp = () =>
  import(/* webpackChunkName: "guarded-app" */ './GuardedApp');
const Welcome = React.lazy(loadWelcome);
const Content = React.lazy(loadContent);
const GuardedApp = React.lazy(loadGuardedApp);

const ConfiguredLayout: React.FC = ({ children }) => {
  const { isAuthenticated } = useAuth0();
  const user = useCurrentUser();
  return isAuthenticated && user ? (
    <Layout
      userProfileHref={network({}).users({}).user({ userId: user.id }).$}
      teams={user.teams.map(({ id, displayName = '' }) => ({
        name: displayName,
        href: network({}).teams({}).team({ teamId: id }).$,
      }))}
      aboutHref="https://www.parkinsonsroadmap.org/"
    >
      {children}
    </Layout>
  ) : (
    <BasicLayout>{children}</BasicLayout>
  );
};

const App: React.FC<Record<string, never>> = () => {
  useEffect(() => {
    loadGuardedApp().then(loadContent).then(loadWelcome);
  }, []);

  return (
    <Frame title="ASAP Hub">
      <GoogleTagManager containerId={GTM_CONTAINER_ID} />
      <AuthProvider>
        <Router history={history}>
          <LastLocationProvider>
            <Frame title={null}>
              <Switch>
                <Route path={welcome.template}>
                  <Welcome />
                </Route>

                <Route exact path={staticPages({}).terms.template}>
                  <ConfiguredLayout>
                    <Frame title={null}>
                      <Content pageId="terms-and-conditions" />
                    </Frame>
                  </ConfiguredLayout>
                </Route>
                <Route exact path={staticPages({}).privacyPolicy.template}>
                  <ConfiguredLayout>
                    <Frame title={null}>
                      <Content pageId="privacy-policy" />
                    </Frame>
                  </ConfiguredLayout>
                </Route>

                <Route>
                  <CheckAuth>
                    <ConfiguredLayout>
                      <Frame title={null}>
                        <GuardedApp />
                      </Frame>
                    </ConfiguredLayout>
                  </CheckAuth>
                </Route>
              </Switch>
            </Frame>
          </LastLocationProvider>
        </Router>
      </AuthProvider>
    </Frame>
  );
};

export default App;
