import React, { useState } from 'react';
import { HashRouter, Switch, Route, Redirect } from 'react-router-dom';
import { BasicLayout } from '@asap-hub/react-components';

import Login from './login/Login';
import ForgotPassword from './forgot-password/ForgotPassword';
import { getHubUrlFromRedirect } from './utils';

const App: React.FC<Record<string, never>> = () => {
  const [email, setEmail] = useState('');
  const hubUrl = getHubUrlFromRedirect();
  return (
    <HashRouter>
      <BasicLayout logoHref={hubUrl}>
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
