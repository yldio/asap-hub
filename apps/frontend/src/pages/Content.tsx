import React from 'react';
import { useRouteMatch } from 'react-router-dom';
import {
  ContentPage,
  Paragraph,
  NotFoundPage,
} from '@asap-hub/react-components';
import { usePageByPath } from '../api';
import ErrorBoundary from '../errors/ErrorBoundary';

interface StubPageProps {
  layoutComponent: React.FC;
}
const StubPage: React.FC<StubPageProps> = ({ layoutComponent: Layout }) => {
  const { path } = useRouteMatch();
  const { loading, data: page } = usePageByPath(path);

  if (loading) {
    return <Paragraph>Loading...</Paragraph>;
  }

  if (page) {
    return (
      <Layout>
        <ErrorBoundary>
          <ContentPage {...page} />
        </ErrorBoundary>
      </Layout>
    );
  }

  return <NotFoundPage />;
};

export default StubPage;
