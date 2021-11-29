import { ReactNode, FC, useEffect } from 'react';
import { useAuth0 } from '@asap-hub/react-context';
import { Loading } from '@asap-hub/react-components';
import { useLocation } from 'react-router-dom';

interface CheckAuthProps {
  children: (state: { isAuthenticated: boolean }) => ReactNode;
}
const CheckAuth: FC<CheckAuthProps> = ({ children }) => {
  const { isAuthenticated, loading, checkSession } = useAuth0();
  const location = useLocation();
  useEffect(() => {
    if (checkSession) checkSession();
  }, [location, checkSession]);

  if (loading) {
    return <Loading />;
  }

  return <>{children({ isAuthenticated: !!isAuthenticated })}</>;
};

export default CheckAuth;
