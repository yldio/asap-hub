import { Auth0, gp2 as gp2Auth } from '@asap-hub/auth';

import { BasicLayout } from '@asap-hub/gp2-components';
import { Loading, NotFoundPage } from '@asap-hub/react-components';
import {
  useAuth0GP2,
  useCurrentUserGP2,
  useNotificationContext,
} from '@asap-hub/react-context';
import { FC, lazy, useEffect, useState } from 'react';
import { Route, Routes, useRouteMatch } from 'react-router-dom';
import { RecoilRoot, useRecoilState, useResetRecoilState } from 'recoil';
import { auth0State } from './auth/state';
import Frame from './Frame';
import NotificationMessages from './NotificationMessages';

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
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    user?.onboarded ? loadOnboardedApp() : loadOnboarding();
  }, [user?.onboarded]);
  const { addNotification } = useNotificationContext();

  const [showWelcomeBackBanner, setShowWelcomeBackBanner] = useState(
    user?.onboarded || false,
  );

  const welcomeBackMessage = `Welcome back to the GP2 Hub${
    user?.firstName ? `, ${user.firstName}` : ''
  }!`;

  useEffect(() => {
    if (showWelcomeBackBanner) {
      addNotification({
        message: welcomeBackMessage,
        page: 'dashboard',
        type: 'info',
      });
      setShowWelcomeBackBanner(false);
    }
  }, [showWelcomeBackBanner, addNotification, welcomeBackMessage]);

  if (!user || !recoilAuth0) {
    return <Loading />;
  }

  return user.onboarded ? (
    <OnboardedApp />
  ) : (
    <BasicLayout>
      <Routes>
        <Route path={path}>
          <Onboarding />
        </Route>
        <Route>
          <Frame title="Not Found">
            <NotFoundPage />
          </Frame>
        </Route>
      </Routes>
    </BasicLayout>
  );
};

const AuthenticatedAppWithRecoil: FC<Record<string, never>> = () => (
  <RecoilRoot>
    <NotificationMessages>
      <AuthenticatedApp />
    </NotificationMessages>
  </RecoilRoot>
);

export default AuthenticatedAppWithRecoil;
