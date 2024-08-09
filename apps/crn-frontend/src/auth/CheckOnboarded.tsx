import { User } from '@asap-hub/auth';
import { useCurrentUserCRN } from '@asap-hub/react-context';
import { logout, networkRoutes, staticPages } from '@asap-hub/routing';
import { ReactNode } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';

interface CheckOnboardedProps {
  children: ReactNode;
}

export const navigationPromptHandler = (
  user: User | null,
  pathname: string,
) => {
  const isNavigationBlocked =
    user && !user?.onboarded
      ? true
      : ![
          networkRoutes.DEFAULT.USERS.DETAILS.ABOUT.buildPath({
            id: user?.id || '',
          }),
          networkRoutes.DEFAULT.USERS.DETAILS.RESEARCH.buildPath({
            id: user?.id || '',
          }),
          staticPages.DEFAULT.TERMS.path,
          staticPages.DEFAULT.PRIVACY_POLICY.path,
          logout.path,
        ].find((route) => pathname === '/' || pathname.startsWith(route));

  if (isNavigationBlocked) {
    window.alert('This link will be available when your profile is complete');
    return false;
  }
  return undefined;
};

const CheckOnboarded: React.FC<CheckOnboardedProps> = ({ children }) => {
  const user = useCurrentUserCRN();
  // const navigate = useNavigate();

  // TODO: FIX THIS
  // useEffect(
  //   () =>
  //     navigate.block(({ pathname }) => navigationPromptHandler(user, pathname)),
  //   [user, history],
  // );

  if (!user) {
    throw new Error(
      'No current user is authenticated. CheckOnboarded expects that a general auth check has already been done and the current user is known.',
    );
  }

  if (user.onboarded) {
    return <>{children}</>;
  }

  const ownProfilePath = networkRoutes.DEFAULT.USERS.DETAILS.buildPath({
    id: user.id,
  });
  return (
    <Routes>
      <Route path={ownProfilePath}>{children}</Route>
      <Route path="*" element={<Navigate to={ownProfilePath} />} />
    </Routes>
  );
};

export default CheckOnboarded;
