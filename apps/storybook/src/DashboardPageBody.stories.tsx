import { ComponentProps } from 'react';
import { DashboardPageBody } from '@asap-hub/react-components';
import {
  createEventResponse,
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
      type: 'Event' as const,
      title:
        'Welcome to the ASAP Collaborative Initiative: The Science & the scientists',
    },
  ],
  userId: 'u42',
  teamId: 't42',
  roles: [],
  pastEvents: [
    createEventResponse({}, 1),
    createEventResponse({}, 2),
    createEventResponse({}, 3),
  ],
  reminders: createListReminderResponse(number('Reminders', 3)).items,
});

export const Normal = () => <DashboardPageBody {...props()} />;
