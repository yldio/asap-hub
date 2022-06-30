import { ComponentProps } from 'react';
import { DashboardPageBody } from '@asap-hub/react-components';

export default {
  title: 'Templates / Dashboard / Page Body',
};

const props = (): ComponentProps<typeof DashboardPageBody> => ({
  pages: [
    {
      id: 'uuid-1',
      path: '/',
      title: 'Welcome Package',
      shortText: [
        "Find your way around the grant, ASAP's ways of working, the deadlines and what is expected of grantees.",
        'Open to read the Welcome Package',
      ].join(''),
      text: '',
    },
  ],
  news: [
    {
      id: 'uuid-1',
      created: new Date().toISOString(),
      type: 'News' as const,
      title: "Coordinating different research interests into Parkinson's",
    },
    {
      id: 'uuid-2',
      created: new Date().toISOString(),
      type: 'Event' as const,
      title:
        'Welcome to the ASAP Collaborative Initiative: The Science & the scientists',
    },
  ],
  userId: 'u42',
  teamId: 't42',
  roles: [],
});

export const Normal = () => <DashboardPageBody {...props()} />;
