import { User } from '@asap-hub/auth';
import { useCurrentUserCRN } from '@asap-hub/react-context';
import { logout, network, staticPages } from '@asap-hub/routing';
import { ReactNode, useEffect } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';

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
  const user = useCurrentUserCRN();
  const location = useLocation();
  const navigate = useNavigate();

  // Note: React Router v6 removed history.block()
  // We now check on each navigation attempt
  useEffect(() => {
    const blocked = navigationPromptHandler(user, location.pathname);
    if (blocked === false) {
      // Navigation was blocked - stay on current page
      // The alert is already shown by navigationPromptHandler
    }
  }, [user, location.pathname]);

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
    <Routes>
      <Route path={`${ownProfilePath}/*`} element={<>{children}</>} />
      <Route path="*" element={<Navigate to={ownProfilePath} replace />} />
    </Routes>
  );
};

export default CheckOnboarded;
