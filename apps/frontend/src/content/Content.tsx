import React from 'react';
import { ContentPage, NotFoundPage, Loading } from '@asap-hub/react-components';

import { usePageByPath } from '../api';
import Frame from '../structure/Frame';

interface ContentProps {
  pageId: string;
}
const Content: React.FC<ContentProps> = ({ pageId }) => {
  const { loading, data: page } = usePageByPath(pageId);

  if (loading) {
    return <Loading />;
  }

  if (page) {
    return (
      <Frame title={page.title}>
        <ContentPage {...page} />
      </Frame>
    );
  }

  return <NotFoundPage />;
};

export default Content;
