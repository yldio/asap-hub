import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { Layout } from '@asap-hub/react-components';

import Login from './login/Login';

const App: React.FC<{}> = () => (
  <BrowserRouter>
    <Layout>
      <Switch>
        <Route exact path="/login">
          <Login />
        </Route>
        <Route>Not Found</Route>
      </Switch>
    </Layout>
  </BrowserRouter>
);

export default App;
