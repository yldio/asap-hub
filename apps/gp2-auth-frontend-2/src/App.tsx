import { HashRouter, Switch, Route, Redirect } from 'react-router-dom';
import { BasicLayout, Theme } from '@asap-hub/gp2-components';
import { useState } from 'react';
import Login from './login/Login';

function App() {
  const [email, setEmail] = useState('');
  return (
    <HashRouter>
      <Theme>
        <BasicLayout logoHref={'/'}>
          <Switch>
            <Route path="/login">
              <Login email={email} setEmail={setEmail} />
            </Route>
            <Route path="/forgot-password">
              <div>forgot password</div>
            </Route>
            <Redirect to="/login" />
          </Switch>
        </BasicLayout>
      </Theme>
    </HashRouter>
  );
}

export default App;
