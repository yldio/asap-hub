import React, { useEffect } from 'react';
import { Router, Switch, Route } from 'react-router-dom';
import {
  Layout,
  BasicLayout,
  mailToFeedback,
} from '@asap-hub/react-components';
import { useAuth0, useCurrentUser } from '@asap-hub/react-context';

import history from './history';
import {
  DISCOVER_PATH,
  NETWORK_PATH,
  SHARED_RESEARCH_PATH,
  NEWS_AND_EVENTS_PATH,
  LOGOUT_PATH,
  EVENTS_PATH,
} from './routes';
import { TEAMS_PATH } from './network/routes';
import AuthProvider from './auth/AuthProvider';
import CheckAuth from './auth/CheckAuth';
import Frame from './structure/Frame';

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
      discoverAsapHref={DISCOVER_PATH}
      sharedResearchHref={SHARED_RESEARCH_PATH}
      networkHref={`${NETWORK_PATH}/${TEAMS_PATH}`}
      newsAndEventsHref={NEWS_AND_EVENTS_PATH}
      userProfileHref={`${NETWORK_PATH}/users/${user.id}`}
      teams={user.teams.map(({ id, displayName = '' }) => ({
        name: displayName,
        href: `${NETWORK_PATH}/${TEAMS_PATH}/${id}`,
      }))}
      settingsHref="/settings"
      feedbackHref={mailToFeedback()}
      logoutHref={LOGOUT_PATH}
      termsHref="/terms-and-conditions"
      privacyPolicyHref="/privacy-policy"
      aboutHref="https://www.parkinsonsroadmap.org/"
      eventsHref={EVENTS_PATH}
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
    <Frame>
      <AuthProvider>
        <Router history={history}>
          <Frame>
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

              <Route>
                <CheckAuth>
                  <ConfiguredLayout>
                    <Frame>
                      <GuardedApp />
                    </Frame>
                  </ConfiguredLayout>
                </CheckAuth>
              </Route>
            </Switch>
          </Frame>
        </Router>
      </AuthProvider>
    </Frame>
  );
};

export default App;
