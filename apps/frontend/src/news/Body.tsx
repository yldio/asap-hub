import React from 'react';
import { NewsAndEventsPageBody, Loading } from '@asap-hub/react-components';

import { useNewsAndEvents } from '../api';

const Body: React.FC<{}> = () => {
  const result = useNewsAndEvents();

  if (result.loading) {
    return <Loading />;
  }

  return <NewsAndEventsPageBody newsAndEvents={result.data.items} />;
};

export default Body;
