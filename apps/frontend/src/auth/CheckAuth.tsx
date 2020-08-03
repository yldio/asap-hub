import React from 'react';
import { useAuth0 } from '@asap-hub/react-context';
import { Layout, Paragraph } from '@asap-hub/react-components';
import Signin from './Signin';

interface CheckAuthProps {
  children: React.ReactNode;
}
const CheckAuth: React.FC<CheckAuthProps> = ({ children }) => {
  const { loading, isAuthenticated } = useAuth0();

  if (loading) {
    // TODO proper loading page here and everywhere else
    return (
      <Layout>
        <Paragraph>Loading...</Paragraph>
      </Layout>
    );
  }

  if (!isAuthenticated) {
    // TODO store current page
    return <Signin />;
  }

  return <>{children}</>;
};

export default CheckAuth;
