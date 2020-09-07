import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { BasicLayout } from '@asap-hub/react-components';

import Login from './login/Login';

const App: React.FC<{}> = () => (
  <BrowserRouter>
    <BasicLayout>
      <Switch>
        <Route exact path="/login">
          <Login />
        </Route>
        <Route>Not Found</Route>
      </Switch>
    </BasicLayout>
  </BrowserRouter>
);

export default App;
