import { FC, lazy, useEffect } from 'react';
import { RecoilRoot } from 'recoil';
import { Router, Switch, Route } from 'react-router-dom';
import { LastLocationProvider } from 'react-router-last-location';

import { useFlags } from '@asap-hub/react-context';
import { ToastStack, UtilityBar } from '@asap-hub/react-components';
import { logout, welcome } from '@asap-hub/routing';
import { Frame } from '@asap-hub/structure';

import history from './history';
import CheckAuth from './auth/CheckAuth';
import Signin from './auth/Signin';
import Logout from './auth/Logout';

const loadAuthProvider = () =>
  import(/* webpackChunkName: "auth-provider" */ './auth/AuthProvider');
const AuthProvider = lazy(loadAuthProvider);

const loadWelcome = () =>
  import(/* webpackChunkName: "welcome" */ './welcome/Routes');
const loadAuthenticatedApp = () =>
  import(/* webpackChunkName: "authenticated-app" */ './AuthenticatedApp');

const Welcome = lazy(loadWelcome);
const AuthenticatedApp = lazy(loadAuthenticatedApp);

const App: FC<Record<string, never>> = () => {
  const { setCurrentOverrides } = useFlags();

  useEffect(() => {
    loadAuthenticatedApp().then(loadWelcome);
    setCurrentOverrides();
  }, [setCurrentOverrides]);

  return (
    <RecoilRoot>
      <Frame title="GP2 Hub">
        <AuthProvider>
          <Router history={history}>
            <LastLocationProvider>
              <Frame title={null}>
                <Switch>
                  <Route path={welcome.template}>
                    <UtilityBar>
                      <ToastStack>
                        <Welcome />
                      </ToastStack>
                    </UtilityBar>
                  </Route>
                  <Route path={logout.template}>
                    <Frame title="Logout">
                      <Logout />
                    </Frame>
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
    </RecoilRoot>
  );
};

export default App;
