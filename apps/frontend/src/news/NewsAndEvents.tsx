import React from 'react';
import { NewsAndEventsPageBody, Paragraph } from '@asap-hub/react-components';
import { useNewsAndEvents } from '../api';

const NewsAndEvents: React.FC = () => {
  const { loading, data: newsAndEvents, error } = useNewsAndEvents();

  if (loading) {
    return <Paragraph>Loading...</Paragraph>;
  }

  if (newsAndEvents) {
    console.log(newsAndEvents);
    return <NewsAndEventsPageBody newsAndEvents={newsAndEvents.items} />;
  }

  return (
    <Paragraph>
      {error.name}
      {': '}
      {error.message}
    </Paragraph>
  );
};

export default NewsAndEvents;
