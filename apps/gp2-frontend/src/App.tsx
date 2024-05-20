import { BasicLayout, Theme } from '@asap-hub/gp2-components';
import {
  GoogleTagManager,
  ToastStack,
  UtilityBar,
} from '@asap-hub/react-components';
import { useFlags } from '@asap-hub/react-context';
import { logout, staticPages, welcome } from '@asap-hub/routing';
import { init, reactRouterV5Instrumentation } from '@sentry/react';
import { Integrations } from '@sentry/tracing';
import { FC, lazy, useEffect } from 'react';
import { Route, Router, Switch } from 'react-router-dom';
import { LastLocationProvider } from 'react-router-last-location';
import CheckAuth from './auth/CheckAuth';
import Logout from './auth/Logout';
import SentryAuth0 from './auth/SentryAuth0';
import Signin from './auth/Signin';
import { ENVIRONMENT, GTM_CONTAINER_ID, RELEASE, SENTRY_DSN } from './config';
import Frame from './Frame';
import history from './history';

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
  tracesSampleRate: 0.2,
  attachStacktrace: true,
  // Turn sampleRate on to reduce the amount of errors sent to Sentry
  sampleRate: 1.0, // 0.1 = 10% of error events will be sent
  allowUrls: [
    'gp2.asap.science/static/js/', // your code
    'gp2-hub.us.auth0.com', // code served from Auth0
    'gp2.asap.science/.auth/static/js', // code served from Auth0
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
const loadContent = () =>
  import(/* webpackChunkName: "content" */ './content/Content');
const loadAuthenticatedApp = () =>
  import(/* webpackChunkName: "authenticated-app" */ './AuthenticatedApp');
const AuthenticatedApp = lazy(loadAuthenticatedApp);
const loadWelcome = () =>
  import(/* webpackChunkName: "welcome" */ './welcome/Routes');
const Content = lazy(loadContent);
const Welcome = lazy(loadWelcome);

const App: FC<Record<string, never>> = () => {
  const { setCurrentOverrides, setEnvironment } = useFlags();

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    loadAuthenticatedApp().then(loadContent).then(loadWelcome);
    setEnvironment(ENVIRONMENT);
    setCurrentOverrides();
  }, [setCurrentOverrides, setEnvironment]);

  return (
    <Frame title="GP2 Hub">
      <Theme>
        <GoogleTagManager containerId={GTM_CONTAINER_ID} />
        <AuthProvider>
          <SentryAuth0 />
          <Router history={history}>
            <LastLocationProvider>
              <Frame title={null}>
                <Routes>
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
                </Routes>
              </Frame>
            </LastLocationProvider>
          </Router>
        </AuthProvider>
      </Theme>
    </Frame>
  );
};

export default App;
