import React from 'react';
import { useAuth0 } from '@asap-hub/react-context';
import { Loading } from '@asap-hub/react-components';

const Signin = React.lazy(() => import('./Signin'));

interface CheckAuthProps {
  children: React.ReactNode;
}
const CheckAuth: React.FC<CheckAuthProps> = ({ children }) => {
  const { loading, isAuthenticated } = useAuth0();

  if (loading) {
    return <Loading />;
  }

  if (!isAuthenticated) {
    return <Signin />;
  }

  return <>{children}</>;
};

export default CheckAuth;
