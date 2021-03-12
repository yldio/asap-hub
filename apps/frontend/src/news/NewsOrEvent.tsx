import React from 'react';

import { useRouteMatch } from 'react-router-dom';
import {
  Loading,
  NotFoundPage,
  NewsOrEventPage,
} from '@asap-hub/react-components';
import { useNewsOrEvent } from '../api';

const NewsOrEvent: React.FC<Record<string, never>> = () => {
  const {
    params: { id },
  } = useRouteMatch<{ id: string }>();
  const { loading, data: newsOrEvent } = useNewsOrEvent(id);

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
