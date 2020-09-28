import React, { useState } from 'react';
import { HashRouter, Switch, Route, Redirect } from 'react-router-dom';
import { BasicLayout } from '@asap-hub/react-components';

import Login from './login/Login';
import ForgotPassword from './forgot-password/ForgotPassword';

const App: React.FC<{}> = () => {
  const [email, setEmail] = useState('');

  return (
    <HashRouter>
      <BasicLayout>
        <Switch>
          <Route path="/login">
            <Login email={email} setEmail={setEmail} />
          </Route>
          <Route path="/forgot-password">
            <ForgotPassword email={email} setEmail={setEmail} />
          </Route>
          <Redirect to="/login" />
        </Switch>
      </BasicLayout>
    </HashRouter>
  );
};

export default App;
