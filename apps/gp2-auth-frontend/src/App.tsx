import { useState } from 'react';
import { HashRouter, Switch, Route, Redirect } from 'react-router-dom';

import { BasicLayout, Theme } from '@asap-hub/gp2-components';
import { getHubUrlFromRedirect } from '@asap-hub/auth-frontend-utils';

import Login from './login/Login';
import ForgotPassword from './forgot-password/ForgotPassword';

const App: React.FC<Record<string, never>> = () => {
  const [email, setEmail] = useState('');
  const hubUrl = getHubUrlFromRedirect();
  return (
    <HashRouter>
      <Theme>
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
      </Theme>
    </HashRouter>
  );
};

export default App;
