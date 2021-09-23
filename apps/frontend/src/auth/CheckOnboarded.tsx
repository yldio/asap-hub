import { useCurrentUser } from '@asap-hub/react-context';
import { network, logout, staticPages } from '@asap-hub/routing';
import { ReactNode, useEffect } from 'react';
import { Redirect, Route, Switch, useHistory } from 'react-router-dom';
import { User } from '@asap-hub/auth';

interface CheckOnboardedProps {
  children: ReactNode;
}

export const navigationPromptHandler = (
  user: User | null,
  pathname: string,
) => {
  const isNavigationBlocked =
    user && !user?.onboarded
      ? ![
          network({}).users({}).user({ userId: user.id }).about({}).$,
          network({}).users({}).user({ userId: user.id }).research({}).$,
          staticPages({}).terms({}).$,
          staticPages({}).privacyPolicy({}).$,
          logout({}).$,
        ].find((route) => pathname === '/' || pathname.startsWith(route))
      : false;

  if (isNavigationBlocked) {
    window.alert('This link will be available when your profile is complete');
    return false;
  }
  return undefined;
};

const CheckOnboarded: React.FC<CheckOnboardedProps> = ({ children }) => {
  const user = useCurrentUser();
  const history = useHistory();

  useEffect(
    () =>
      history.block(({ pathname }) => navigationPromptHandler(user, pathname)),
    [user, history],
  );

  if (!user) {
    throw new Error(
      'No current user is authenticated. CheckOnboarded expects that a general auth check has already been done and the current user is known.',
    );
  }

  const ownProfilePath = network({}).users({}).user({ userId: user.id }).$;

  if (user.onboarded) {
    return <>{children}</>;
  }

  return (
    <Switch>
      <Route path={ownProfilePath}>{children}</Route>
      <Redirect to={ownProfilePath} />
    </Switch>
  );
};

export default CheckOnboarded;
