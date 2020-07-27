import React from 'react';
import { Router, Switch, Route } from 'react-router-dom';
import { AuthProvider } from './auth';
import Admin from './admin/Admin';
import history from './history';
import Dashboard from './dashboard/Dashboard';
import Welcome from './onboarding/Welcome';
import CreateProfile from './onboarding/CreateProfile';
import Users from './users/Routes';
import Teams from './teams/Routes';

const App: React.FC<{}> = () => {
  return (
    <AuthProvider>
      <Router history={history}>
        <Switch>
          <Route exact path="/" component={Dashboard} />
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
