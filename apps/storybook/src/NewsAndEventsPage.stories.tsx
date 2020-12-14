import React from 'react';
import {
  NewsAndEventsPage,
  NewsAndEventsPageBody,
} from '@asap-hub/react-components';

import { LayoutDecorator } from './layout';

export default {
  title: 'Pages / News and Events',
  decorators: [LayoutDecorator],
};

const props = () => ({
  newsAndEvents: [
    {
      id: 'uuid-1',
      created: new Date().toISOString(),
      type: 'News' as const,
      title: "Coordinating different approaches into Parkinson's",
      subtitle:
        'Point of view from ASAP scientific director, Randy Schekman, PhD and managing director, Ekemini A. U. Riley, PhD.',
      href: '#',
    },
    {
      id: 'uuid-2',
      created: new Date().toISOString(),
      type: 'Event' as const,
      title:
        'Welcome to the ASAP Collaborative Initiative: The Science & the scientists',
      href: '#',
    },
  ],
});

export const NewsAndEventsList = () => (
  <NewsAndEventsPage>
    <NewsAndEventsPageBody {...props()} />
  </NewsAndEventsPage>
);
