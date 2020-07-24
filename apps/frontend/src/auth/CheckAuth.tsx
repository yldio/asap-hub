import React from 'react';
import { Redirect } from 'react-router-dom';
import { useAuth0 } from '@asap-hub/react-context';
import { Layout, Paragraph } from '@asap-hub/react-components';

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
    return <Redirect to="/" />;
  }

  return <>{children}</>;
};

export default CheckAuth;
