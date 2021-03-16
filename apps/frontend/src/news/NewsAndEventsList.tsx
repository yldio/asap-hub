import React from 'react';
import { NewsAndEventsPageBody, Loading } from '@asap-hub/react-components';

import { useNewsAndEvents } from '../api';

const NewsAndEventsList: React.FC<Record<string, never>> = () => {
  const result = useNewsAndEvents();

  if (result.loading) {
    return <Loading />;
  }

  return <NewsAndEventsPageBody newsAndEvents={result.data.items} />;
};

export default NewsAndEventsList;
