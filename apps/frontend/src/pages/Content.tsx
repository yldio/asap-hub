import React from 'react';
import { useRouteMatch } from 'react-router-dom';
import { ContentPage, Paragraph } from '@asap-hub/react-components';
import { usePagesByPath } from '../api';

interface StubPageProps {
  layoutComponent: React.FC;
}
const StubPage: React.FC<StubPageProps> = ({ layoutComponent: Layout }) => {
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
