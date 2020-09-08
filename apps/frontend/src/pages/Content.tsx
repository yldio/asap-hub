import React from 'react';
import { useRouteMatch } from 'react-router-dom';
import {
  Layout as LoggedInLayout,
  BasicLayout as LoggedOutLayout,
  ContentPage,
  Paragraph,
} from '@asap-hub/react-components';
import { useAuth0 } from '@asap-hub/react-context';
import { usePagesByPath } from '../api';

const StubPage: React.FC<{}> = () => {
  const { isAuthenticated = false } = useAuth0();
  const Layout = isAuthenticated ? LoggedInLayout : LoggedOutLayout;

  const { path } = useRouteMatch();
  const { loading, data: page, error } = usePagesByPath(path);

  if (loading) {
    return <Paragraph>Loading...</Paragraph>;
  }

  if (page) {
    return (
      <Layout>
        <ContentPage {...page} />
      </Layout>
    );
  }

  return (
    <Layout>
      <Paragraph>
        {error.name}
        {': '}
        {error.message}
      </Paragraph>
    </Layout>
  );
};

export default StubPage;
