import React from 'react';

import { useAuth0 } from '@asap-hub/react-context';
import { Layout, Paragraph } from '@asap-hub/react-components';
import Login from './Login';

export { default as AuthProvider } from './AuthProvider';
export const withUser = (Component: React.FC) => (props: object) => {
  const { isAuthenticated, loading } = useAuth0();

  if (loading) {
    // TODO proper loading page here and everywhere else
    return (
      <Layout>
        <Paragraph>Loading...</Paragraph>
      </Layout>
    );
  }

  if (isAuthenticated) {
    return <Component {...props} />;
  }

  return <Login />;
};
