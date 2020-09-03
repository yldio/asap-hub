import React from 'react';
import { useRouteMatch } from 'react-router-dom';
import { Layout, ContentPage, Paragraph } from '@asap-hub/react-components';
import { useAuth0 } from '@asap-hub/react-context';
import { usePagesByPath } from '../api';

const StubPage: React.FC<{}> = () => {
  const { path } = useRouteMatch();
  const { isAuthenticated = false } = useAuth0();
  const { loading, data: page, error } = usePagesByPath(path);

  if (loading) {
    return <Paragraph>Loading...</Paragraph>;
  }

  if (page) {
    return (
      <Layout navigation={isAuthenticated}>
        <ContentPage {...page} />
      </Layout>
    );
  }

  return (
    <Layout navigation={isAuthenticated}>
      <Paragraph>
        {error.name}
        {': '}
        {error.message}
      </Paragraph>
    </Layout>
  );
};

export default StubPage;
