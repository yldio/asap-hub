import React from 'react';
import { join } from 'path';
import { NewsAndEventsPageBody, Loading } from '@asap-hub/react-components';

import { useNewsAndEvents } from '../api';
import { NEWS_AND_EVENTS_PATH } from '../routes';

const NewsAndEventsList: React.FC<Record<string, never>> = () => {
  const result = useNewsAndEvents();

  if (result.loading) {
    return <Loading />;
  }

  return (
    <NewsAndEventsPageBody
      newsAndEvents={result.data.items.map((n) => ({
        ...n,
        href: join(NEWS_AND_EVENTS_PATH, n.id),
      }))}
    />
  );
};

export default NewsAndEventsList;
