import { ReactNode, FC } from 'react';
import { useAuth0 } from '@asap-hub/react-context';
import { Loading } from '@asap-hub/react-components';

interface CheckAuthProps {
  children: (state: { isAuthenticated: boolean }) => ReactNode;
}
const CheckAuth: FC<CheckAuthProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth0();
  if (loading) {
    return <Loading />;
  }

  return <>{children({ isAuthenticated: !!isAuthenticated })}</>;
};

export default CheckAuth;
