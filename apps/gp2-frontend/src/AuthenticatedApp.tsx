import { FC } from 'react';
// import { Switch, Route } from 'react-router-dom';
// import { useResetRecoilState, useRecoilState } from 'recoil';
import { Layout } from '@asap-hub/gp2-components';
// import { NotFoundPage, Loading } from '@asap-hub/react-components';
// import { useAuth0, useCurrentUser } from '@asap-hub/react-context';

// import { Frame } from '@asap-hub/frontend-utils';

// import { auth0State } from './auth/state';

const AuthenticatedApp: FC<Record<string, never>> = () => (
  <Layout>
    {/* <Switch>
        <Route exact path="/">
          <Frame title="Dashboard">
            <Dashboard />
          </Frame>
        </Route>
        <Route>
          <Frame title="Not Found">
            <NotFoundPage />
          </Frame>
        </Route>
      </Switch> */}
  </Layout>
);

export default AuthenticatedApp;
