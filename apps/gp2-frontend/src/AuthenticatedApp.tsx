import { Auth0, gp2 as gp2Auth } from '@asap-hub/auth';
import { Frame } from '@asap-hub/frontend-utils';
import { BasicLayout } from '@asap-hub/gp2-components';
import { Loading, NotFoundPage } from '@asap-hub/react-components';
import { useAuth0GP2, useCurrentUserGP2 } from '@asap-hub/react-context';
import { FC, lazy, useEffect } from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { RecoilRoot, useRecoilState, useResetRecoilState } from 'recoil';
import { auth0State } from './auth/state';

const loadOnboardedApp = () =>
  import(/* webpackChunkName: "onboarded-app" */ './OnboardedApp');
const loadOnboarding = () =>
  import(/* webpackChunkName: "onboarding" */ './onboarding/Routes');

const OnboardedApp = lazy(loadOnboardedApp);
const Onboarding = lazy(loadOnboarding);

const AuthenticatedApp: FC<Record<string, never>> = () => {
  const auth0 = useAuth0GP2();
  const [recoilAuth0, setAuth0] = useRecoilState<
    Auth0<gp2Auth.User> | undefined
  >(auth0State);
  const resetAuth0 = useResetRecoilState(auth0State);
  const { path } = useRouteMatch();

  useEffect(() => {
    setAuth0(auth0);
    return () => resetAuth0();
  }, [auth0, setAuth0, resetAuth0]);
  const user = useCurrentUserGP2();

  useEffect(() => {
    // order by the likelyhood of user navigating there
    user?.onboarded ? loadOnboardedApp() : loadOnboarding();
  }, [user?.onboarded]);

  if (!user || !recoilAuth0) {
    return <Loading />;
  }

  return user.onboarded ? (
    <OnboardedApp />
  ) : (
    <Switch>
      <Route path={path}>
        <Onboarding />
      </Route>
      <Route>
        <Frame title="Not Found">
          <BasicLayout>
            <NotFoundPage />
          </BasicLayout>
        </Frame>
      </Route>
    </Switch>
  );
};

const AuthenticatedAppWithRecoil: FC<Record<string, never>> = () => (
  <RecoilRoot>
    <AuthenticatedApp />
  </RecoilRoot>
);

export default AuthenticatedAppWithRecoil;
