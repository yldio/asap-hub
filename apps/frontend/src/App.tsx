import React from 'react';
import { Router, Switch, Route } from 'react-router-dom';

import Home from './home/Home';
import { AuthProvider } from './auth';
import Admin from './admin/Admin';
import Profile from './pages/ProfilePage';
import history from './history';
import Welcome from './onboarding/Welcome';
import ContinueOnboarding from './onboarding/ContinueOnboarding';
import CreateProfile from './onboarding/CreateProfile';

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
          <Route path="/members/:id" component={Profile} />
          <Route exact path="/welcome/:code/" component={Welcome} />
          <Route exact path="/create-profile" component={CreateProfile} />
          <Route exact path="/admin/" component={Admin} />
          <Route exact path="/" component={AuthCallbackGuardedHome} />
          <Route render={() => 'Not found'} />
        </Switch>
      </Router>
    </AuthProvider>
  );
};

export default App;
