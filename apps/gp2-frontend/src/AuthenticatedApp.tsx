import { BasicLayout } from '@asap-hub/gp2-components';
import { Loading, NotFoundPage } from '@asap-hub/react-components';
import {
  useCurrentUserGP2,
  useFlags,
  useNotificationContext,
} from '@asap-hub/react-context';
import { queryClientDefaultOptions } from '@asap-hub/frontend-utils';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { FC, lazy, useEffect, useState } from 'react';
import { Route, Routes } from 'react-router';
import Frame from './Frame';
import NotificationMessages from './NotificationMessages';
import ReactQueryDevtoolsProduction from './ReactQueryDevtoolsProduction';

const loadOnboardedApp = () =>
  import(/* webpackChunkName: "onboarded-app" */ './OnboardedApp');
const loadOnboarding = () =>
  import(/* webpackChunkName: "onboarding" */ './onboarding/Routes');

const OnboardedApp = lazy(loadOnboardedApp);
const Onboarding = lazy(loadOnboarding);

const AuthenticatedApp: FC<Record<string, never>> = () => {
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

  // `user` is derived from the auth0 context (null until auth0 finishes
  // loading and a user is present), so this guard also covers the pre-ready
  // state the recoil `auth0State` sync used to gate on.
  if (!user) {
    return <Loading />;
  }

  return user.onboarded ? (
    <OnboardedApp />
  ) : (
    <BasicLayout>
      <Routes>
        <Route path="/*" element={<Onboarding />} />
        <Route
          path="*"
          element={
            <Frame title="Not Found">
              <NotFoundPage />
            </Frame>
          }
        />
      </Routes>
    </BasicLayout>
  );
};

const AuthenticatedAppWithProviders: FC<Record<string, never>> = () => {
  // The QueryClient lives and dies with this component: on logout the
  // AuthenticatedApp unmounts and the whole cache is discarded (the same
  // logout cache-wipe semantics the old RecoilRoot provided).
  const [queryClient] = useState(
    () => new QueryClient({ defaultOptions: queryClientDefaultOptions }),
  );
  const { isEnabled } = useFlags();
  return (
    <QueryClientProvider client={queryClient}>
      <NotificationMessages>
        <AuthenticatedApp />
      </NotificationMessages>
      {isEnabled('QUERY_DEVTOOLS') && <ReactQueryDevtoolsProduction />}
    </QueryClientProvider>
  );
};

export default AuthenticatedAppWithProviders;
