import { Loading } from '@asap-hub/react-components';
import { useAuth0CRN } from '@asap-hub/react-context';
import { FC, ReactNode, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface CheckAuthProps {
  children: (state: { isAuthenticated: boolean }) => ReactNode;
}
const CheckAuth: FC<CheckAuthProps> = ({ children }) => {
  const { isAuthenticated, loading, checkSession } = useAuth0CRN();
  const location = useLocation();
  useEffect(() => {
    if (checkSession) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      checkSession();
    }
  }, [location, checkSession]);

  if (loading) {
    return <Loading />;
  }

  return <>{children({ isAuthenticated: !!isAuthenticated })}</>;
};

export default CheckAuth;
