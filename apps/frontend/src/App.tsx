import { FC, lazy, useEffect } from 'react';
import { Router, Switch, Route } from 'react-router-dom';
import { LastLocationProvider } from 'react-router-last-location';
import {
  BasicLayout,
  GoogleTagManager,
  ToastStack,
} from '@asap-hub/react-components';
import { staticPages, welcome, logout } from '@asap-hub/routing';

import history from './history';
import CheckAuth from './auth/CheckAuth';
import Signin from './auth/Signin';
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
const loadAuthenticatedApp = () =>
  import(/* webpackChunkName: "authenticated-app" */ './AuthenticatedApp');
const Welcome = lazy(loadWelcome);
const Content = lazy(loadContent);
const AuthenticatedApp = lazy(loadAuthenticatedApp);

const App: FC<Record<string, never>> = () => {
  useEffect(() => {
    loadAuthenticatedApp().then(loadContent).then(loadWelcome);
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
                  <BasicLayout>
                    <Frame title={null}>
                      <Content pageId="terms-and-conditions" />
                    </Frame>
                  </BasicLayout>
                </Route>
                <Route exact path={staticPages({}).privacyPolicy.template}>
                  <BasicLayout>
                    <Frame title={null}>
                      <Content pageId="privacy-policy" />
                    </Frame>
                  </BasicLayout>
                </Route>
                <Route>
                  <CheckAuth>
                    {({ isAuthenticated }) =>
                      !isAuthenticated ? (
                        <Frame title={null}>
                          <Signin />
                        </Frame>
                      ) : (
                        <Frame title={null}>
                          <AuthenticatedApp />
                        </Frame>
                      )
                    }
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
