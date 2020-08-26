import React from 'react';
import { useRouteMatch } from 'react-router-dom';
import { Layout, RichText, Display } from '@asap-hub/react-components';
import { useAuth0 } from '@asap-hub/react-context';
import { usePagesByPath } from '../api';

const StubPage: React.FC<{}> = () => {
  const { path } = useRouteMatch();
  const { isAuthenticated = false } = useAuth0();
  const { loading, data: page } = usePagesByPath(path);

  if (loading) {
    return null;
  }

  const { text, title } = page as { title: string; text: string };
  return (
    <Layout navigation={isAuthenticated}>
      <Display>{title}</Display>
      <RichText toc text={text} />
    </Layout>
  );
};

export default StubPage;
