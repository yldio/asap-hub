import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import Home from './home/Home';
import { AuthProvider } from './auth';
import Admin from './admin/Admin';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Switch>
          <Route path="/admin/" component={Admin} />
          <Route component={Home} />
        </Switch>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
