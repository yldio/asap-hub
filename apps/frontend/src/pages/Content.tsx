import React from 'react';
import { useRouteMatch } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import {
  ContentPage,
  Paragraph,
  NotFoundPage,
  ErrorCard,
} from '@asap-hub/react-components';
import { usePageByPath } from '../api';

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
        <ErrorBoundary FallbackComponent={ErrorCard}>
          <ContentPage {...page} />
        </ErrorBoundary>
      </Layout>
    );
  }

  return <NotFoundPage />;
};

export default StubPage;
