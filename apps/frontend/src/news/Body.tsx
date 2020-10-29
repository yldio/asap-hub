import React from 'react';
import { NewsAndEventsPageBody, Paragraph } from '@asap-hub/react-components';

import { useNewsAndEvents } from '../api';

const Body: React.FC<{}> = () => {
  const result = useNewsAndEvents();

  if (result.loading) {
    return <Paragraph>Loading...</Paragraph>;
  }

  return <NewsAndEventsPageBody newsAndEvents={result.data.items} />;
};

export default Body;
