import React from 'react';
import { useRouteMatch } from 'react-router-dom';
import { Layout, Paragraph } from '@asap-hub/react-components';
import { useAuth0 } from '@asap-hub/react-context';

const StubPage: React.FC<{}> = () => {
  const { path } = useRouteMatch();
  const { isAuthenticated, loading } = useAuth0();
  const [, slug] = path.split('/');

  if (loading) {
    return null;
  }

  return (
    <Layout navigation={isAuthenticated}>
      <Paragraph>{slug}</Paragraph>
    </Layout>
  );
};

export default StubPage;
