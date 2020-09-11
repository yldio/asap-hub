import React from 'react';
import { Router, Switch, Route } from 'react-router-dom';
import { Layout, BasicLayout } from '@asap-hub/react-components';
import { useAuth0 } from '@asap-hub/react-context';

import Admin from './admin/Admin';
import CreateProfile from './onboarding/CreateProfile';
import history from './history';
import Home from './home/Home';
import News from './news/Routes';
import Teams from './teams/Routes';
import Users from './users/Routes';
import Welcome from './welcome/Routes';
import { AuthProvider } from './auth';
import ResearchOutputs from './research-outputs/Routes';
import CheckAuth from './auth/CheckAuth';
import Page from './pages/Content';

const ConfiguredLayout: React.FC = ({ children }) => {
  const { isAuthenticated } = useAuth0();
  return isAuthenticated ? (
    <Layout
      libraryHref="/library"
      networkHref="/users"
      newsAndEventsHref="/news-and-events"
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
        <Switch>
          <Route path="/welcome" component={Welcome} />

          <Route exact path="/terms-and-conditions">
            <Page layoutComponent={ConfiguredLayout} />
          </Route>
          <Route exact path="/privacy-policy">
            <Page layoutComponent={ConfiguredLayout} />
          </Route>

          <Route exact path="/admin" component={Admin} />

          <Route>
            <CheckAuth>
              <ConfiguredLayout>
                <Switch>
                  <Route exact path="/">
                    <Home />
                  </Route>

                  <Route path="/create-profile" component={CreateProfile} />

                  <Route path="/news" component={News} />
                  <Route path="/teams" component={Teams} />
                  <Route path="/users" component={Users} />
                  <Route path="/research-outputs" component={ResearchOutputs} />

                  <Route>Not Found</Route>
                </Switch>
              </ConfiguredLayout>
            </CheckAuth>
          </Route>
        </Switch>
      </Router>
    </AuthProvider>
  );
};

export default App;
