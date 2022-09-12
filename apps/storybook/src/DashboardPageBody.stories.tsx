import { ComponentProps } from 'react';
import { DashboardPageBody } from '@asap-hub/react-components';
import {
  createListEventResponse,
  createListReminderResponse,
} from '@asap-hub/fixtures';
import { number } from '@storybook/addon-knobs';

export default {
  title: 'Templates / Dashboard / Page Body',
};

const props = (): ComponentProps<typeof DashboardPageBody> => ({
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
      type: 'Tutorial' as const,
      title:
        'Welcome to the ASAP Collaborative Initiative: The Science & the scientists',
    },
  ],
  userId: 'u42',
  teamId: 't42',
  roles: [],
  pastEvents: createListEventResponse(3).items,
  reminders: createListReminderResponse(number('Reminders', 3)).items,
  upcomingEvents: createListEventResponse(number('Number of events', 4)),
});

export const Normal = () => <DashboardPageBody {...props()} />;
