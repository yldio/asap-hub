import React from 'react';
import { Router, Switch, Route } from 'react-router-dom';

import Home from './home/Home';
import { AuthProvider } from './auth';
import Admin from './admin/Admin';
import history from './history';

function App() {
  return (
    <AuthProvider>
      <Router history={history}>
        <Switch>
          <Route path="/admin/" component={Admin} />
          <Route component={Home} />
        </Switch>
      </Router>
    </AuthProvider>
  );
}

export default App;
