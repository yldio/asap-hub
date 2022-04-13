import { FC, lazy, useEffect } from 'react';
import { RecoilRoot } from 'recoil';
import { Router, Switch, Route } from 'react-router-dom';
import { LastLocationProvider } from 'react-router-last-location';
import { init, reactRouterV5Instrumentation } from '@sentry/react';
import { Integrations } from '@sentry/tracing';
import { useFlags } from '@asap-hub/react-context';

import {
  BasicLayout,
  GoogleTagManager,
  ToastStack,
  UtilityBar,
} from '@asap-hub/react-components';
import { staticPages, welcome, logout } from '@asap-hub/routing';
import { Frame } from '@asap-hub/structure';
import history from './history';
import CheckAuth from './auth/CheckAuth';
import Signin from './auth/Signin';
import Logout from './auth/Logout';

import { GTM_CONTAINER_ID, SENTRY_DSN, ENVIRONMENT, RELEASE } from './config';
import SentryAuth0 from './auth/SentryAuth0';

init({
  dsn: SENTRY_DSN,
  release: RELEASE,
  integrations: [
    new Integrations.BrowserTracing({
      // Can also use reactRouterV3Instrumentation or reactRouterV4Instrumentation
      routingInstrumentation: reactRouterV5Instrumentation(history),
    }),
  ],
  environment: ENVIRONMENT,
  // Is recommended adjusting this value in production, or using tracesSampler
  // for finer control
  tracesSampleRate: 1.0,
  attachStacktrace: true,
  // Turn sampleRate on to reduce the amount of data sent to Sentry
  // sampleRate: 0.1, // 0.1 = 10% of error events will be sent
  allowUrls: [
    'hub.asap.science/static/js/', // your code
    'asap-hub.us.auth0.com', // code served from Auth0
    'hub.asap.science/.auth/static/js', // code served from Auth0
  ],
  denyUrls: [
    /fonts\.googleapis\.com/i, // code served from Google Fonts
    /extensions\//i, // Chrome extensions
    /^chrome:\/\//i, // Chrome extensions
    /gtag\/js\//i, // Google Tag Manager
  ],
  ignoreErrors: [
    /Failed to fetch \w+.*? list. Expected status 2xx. Received status 401/g,
    /Loading chunk [0-9]*? failed/g,
    /Object Not Found Matching Id:\d/g,
    /Can't find variable: globalThis/g,
  ],
});

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
  const { setCurrentOverrides } = useFlags();

  useEffect(() => {
    loadAuthenticatedApp().then(loadContent).then(loadWelcome);
    setCurrentOverrides();
  }, [setCurrentOverrides]);

  return (
    <RecoilRoot>
      <Frame title="ASAP Hub">
        <GoogleTagManager containerId={GTM_CONTAINER_ID} />
        <AuthProvider>
          <SentryAuth0 />
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
    </RecoilRoot>
  );
};

export default App;
