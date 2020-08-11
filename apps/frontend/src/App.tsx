import React from 'react';
import { Router, Switch, Route } from 'react-router-dom';

import Admin from './admin/Admin';
import CreateProfile from './onboarding/CreateProfile';
import history from './history';
import Home from './home/Home';
import News from './news/Routes';
import Teams from './teams/Routes';
import Users from './users/Routes';
import Welcome from './welcome/Routes';
import { AuthProvider } from './auth';
import ResearchOutputRoutes from './research-outputs/Routes';
import CheckAuth from './auth/CheckAuth';
import ContinueOnboarding from './onboarding/ContinueOnboarding';
import Page from './pages/page';

const AuthCallbackGuardedHome: React.FC<{}> = () => (
  <CheckAuth>
    <ContinueOnboarding>
      <Home />
    </ContinueOnboarding>
  </CheckAuth>
);

const App: React.FC<{}> = () => {
  return (
    <AuthProvider>
      <Router history={history}>
        <Switch>
          <Route exact path="/" component={AuthCallbackGuardedHome} />

          <Route path="/news" component={News} />
          <Route path="/teams" component={Teams} />
          <Route path="/users" component={Users} />
          <Route path="/research-outputs" component={ResearchOutputRoutes} />
          <Route path="/welcome" component={Welcome} />
          <Route exact path="/terms-and-conditions" component={Page} />
          <Route exact path="/privacy-policy" component={Page} />

          <Route exact path="/create-profile" component={CreateProfile} />
          <Route exact path="/admin" component={Admin} />

          <Route render={() => 'Not found'} />
        </Switch>
      </Router>
    </AuthProvider>
  );
};

export default App;
