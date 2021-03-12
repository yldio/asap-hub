import React from 'react';
import {
  Loading,
  NotFoundPage,
  NewsOrEventPage,
} from '@asap-hub/react-components';
import { news, useRouteParams } from '@asap-hub/routing';

import { useNewsOrEvent } from '../api';

const NewsOrEvent: React.FC<Record<string, never>> = () => {
  const { articleId } = useRouteParams(news({}).article);
  const { loading, data: newsOrEvent } = useNewsOrEvent(articleId);

  if (loading) {
    return <Loading />;
  }

  if (newsOrEvent) {
    const props = {
      ...newsOrEvent,
      text: newsOrEvent.text || '',
    };
    return <NewsOrEventPage {...props} />;
  }

  return <NotFoundPage />;
};

export default NewsOrEvent;
