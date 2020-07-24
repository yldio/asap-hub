import React from 'react';
import { Router, Switch, Route } from 'react-router-dom';

import Home from './home/Home';
import { AuthProvider } from './auth';
import Admin from './admin/Admin';
import history from './history';
import Welcome from './onboarding/Welcome';
import ContinueOnboarding from './onboarding/ContinueOnboarding';
import CreateProfile from './onboarding/CreateProfile';
import Users from './users/Routes';
import Teams from './teams/Routes';

const AuthCallbackGuardedHome: React.FC<{}> = () => (
  <ContinueOnboarding>
    <Home />
  </ContinueOnboarding>
);

const App: React.FC<{}> = () => {
  return (
    <AuthProvider>
      <Router history={history}>
        <Switch>
          <Route exact path="/" component={AuthCallbackGuardedHome} />
          <Route path="/users" component={Users} />
          <Route path="/teams" component={Teams} />

          <Route exact path="/welcome/:code" component={Welcome} />
          <Route exact path="/create-profile" component={CreateProfile} />

          <Route exact path="/admin" component={Admin} />

          <Route render={() => 'Not found'} />
        </Switch>
      </Router>
    </AuthProvider>
  );
};

export default App;
