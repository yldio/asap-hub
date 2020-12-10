import React from 'react';
import { useRouteMatch } from 'react-router-dom';
import { ContentPage, NotFoundPage, Loading } from '@asap-hub/react-components';

import { usePageByPath } from '../api';
import ErrorBoundary from '../errors/ErrorBoundary';

interface ContentProps {
  layoutComponent: React.FC;
}
const Content: React.FC<ContentProps> = ({ layoutComponent: Layout }) => {
  const { path } = useRouteMatch();
  const { loading, data: page } = usePageByPath(path);

  if (loading) {
    return <Loading />;
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

export default Content;
