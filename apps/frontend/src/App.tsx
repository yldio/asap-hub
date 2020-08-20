import React from 'react';
import { Router, Switch, Route } from 'react-router-dom';
import { Layout } from '@asap-hub/react-components';

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
import ContinueOnboarding from './onboarding/ContinueOnboarding';
import Page from './pages/stub';

const App: React.FC<{}> = () => {
  return (
    <AuthProvider>
      <Router history={history}>
        <Switch>
          <Route path="/welcome" component={Welcome} />
          <Route exact path="/terms-and-conditions" component={Page} />
          <Route exact path="/privacy-policy" component={Page} />
          <Route exact path="/admin" component={Admin} />

          <Route>
            <CheckAuth>
              <Layout navigation>
                <Switch>
                  <Route exact path="/">
                    <ContinueOnboarding>
                      <Home />
                    </ContinueOnboarding>
                  </Route>

                  <Route path="/create-profile" component={CreateProfile} />

                  <Route path="/news" component={News} />
                  <Route path="/teams" component={Teams} />
                  <Route path="/users" component={Users} />
                  <Route path="/research-outputs" component={ResearchOutputs} />

                  <Route>Not Found</Route>
                </Switch>
              </Layout>
            </CheckAuth>
          </Route>
        </Switch>
      </Router>
    </AuthProvider>
  );
};

export default App;
