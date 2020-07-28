import React from 'react';
import { Router, Switch, Route } from 'react-router-dom';

import Admin from './admin/Admin';
import ContinueOnboarding from './onboarding/ContinueOnboarding';
import CreateProfile from './onboarding/CreateProfile';
import history from './history';
import Home from './home/Home';
import News from './news/Routes';
import Teams from './teams/Routes';
import Users from './users/Routes';
import Welcome from './onboarding/Welcome';

import { AuthProvider } from './auth';

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
          <Route path="/news" component={News} />
          <Route path="/teams" component={Teams} />
          <Route path="/users" component={Users} />

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
