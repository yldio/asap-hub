import { FC, lazy, useEffect } from 'react';
import { Router, Switch, Route } from 'react-router-dom';
import { LastLocationProvider } from 'react-router-last-location';
import {
  Layout,
  BasicLayout,
  GoogleTagManager,
  ToastStack,
} from '@asap-hub/react-components';
import { useAuth0, useCurrentUser } from '@asap-hub/react-context';
import { staticPages, network, welcome, logout } from '@asap-hub/routing';

import history from './history';
import CheckAuth from './auth/CheckAuth';
import Logout from './auth/Logout';
import Frame from './structure/Frame';
import { GTM_CONTAINER_ID } from './config';

const loadAuthProvider = () =>
  import(/* webpackChunkName: "auth-provider" */ './auth/AuthProvider');
const AuthProvider = lazy(loadAuthProvider);

const loadWelcome = () =>
  import(/* webpackChunkName: "welcome" */ './welcome/Routes');
const loadContent = () =>
  import(/* webpackChunkName: "content" */ './content/Content');
const loadGuardedApp = () =>
  import(/* webpackChunkName: "guarded-app" */ './GuardedApp');
const Welcome = lazy(loadWelcome);
const Content = lazy(loadContent);
const GuardedApp = lazy(loadGuardedApp);

const ConfiguredLayout: FC = ({ children }) => {
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

const App: FC<Record<string, never>> = () => {
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
                  <ToastStack>
                    <Welcome />
                  </ToastStack>
                </Route>
                <Route path={logout.template}>
                  <Frame title="Logout">
                    <Logout />
                  </Frame>
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
