import { FC } from 'react';
// import { Switch, Route } from 'react-router-dom';
// import { useResetRecoilState, useRecoilState } from 'recoil';
import { Layout } from '@asap-hub/gp2-components';
// import { NotFoundPage, Loading } from '@asap-hub/react-components';
// import { useAuth0, useCurrentUser } from '@asap-hub/react-context';

// import { Frame } from '@asap-hub/frontend-utils';

// import { auth0State } from './auth/state';

const AuthenticatedApp: FC<Record<string, never>> = () => {
  // const auth0 = useAuth0();
  // const [recoilAuth0, setAuth0] = useRecoilState(auth0State);
  // const resetAuth0 = useResetRecoilState(auth0State);
  // useEffect(() => {
  //   setAuth0(auth0);
  //   return () => resetAuth0();
  // }, [auth0, setAuth0, resetAuth0]);

  // const user = useCurrentUser();
  // if (!user || !recoilAuth0) {
  //   return <Loading />;
  // }

  return (
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
};

export default AuthenticatedApp;
