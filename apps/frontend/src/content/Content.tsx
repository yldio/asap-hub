import React from 'react';
import { useRouteMatch } from 'react-router-dom';
import { ContentPage, NotFoundPage, Loading } from '@asap-hub/react-components';

import { usePageByPath } from '../api';
import Frame from '../structure/Frame';

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
        <Frame title={page.title}>
          <ContentPage {...page} />
        </Frame>
      </Layout>
    );
  }

  return <NotFoundPage />;
};

export default Content;
