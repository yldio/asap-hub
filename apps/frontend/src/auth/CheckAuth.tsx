import { ReactNode, FC, useEffect, useState } from 'react';
import { useAuth0 } from '@asap-hub/react-context';
import { Loading } from '@asap-hub/react-components';
import { useLocation } from 'react-router-dom';
import { Auth0Client } from '@auth0/auth0-spa-js';

interface CheckAuthProps {
  children: (state: { isAuthenticated: boolean }) => ReactNode;
}
const CheckAuth: FC<CheckAuthProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth0();
  const [auth0Client, _] = useState<Auth0Client>();
  const location = useLocation();

  useEffect(() => {
    const checkSession = async () => {
      if (auth0Client) {
        try {
          await auth0Client.checkSession(); // use refresh token to get new access token if required
          // eslint-disable-next-line
        } catch (error) {} // Invalid refresh token proceed as if user isn't logged in
      }
    };
    checkSession();
    // eslint-disable-next-line
  }, [location]);
  if (loading) {
    return <Loading />;
  }

  return <>{children({ isAuthenticated: !!isAuthenticated })}</>;
};

export default CheckAuth;
