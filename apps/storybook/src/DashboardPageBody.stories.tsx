import { ComponentProps } from 'react';
import { DashboardPageBody } from '@asap-hub/react-components';
import {
  createListEventResponse,
  createListReminderResponse,
  createListResearchOutputResponse,
  createListUserResponse,
} from '@asap-hub/fixtures';
import { number, text } from '@storybook/addon-knobs';

export default {
  title: 'Templates / Dashboard / Page Body',
};

const props = (): ComponentProps<typeof DashboardPageBody> => ({
  news: [
    {
      id: 'uuid-1',
      created: new Date().toISOString(),
      title: 'Learn about Protocols.io, an ASAP preferred tool',
      shortText:
        'Discover current and planned tools (e.g., animal & cell models, antibodies, vectors, tissues, etc.) in a sortable table. This will be a living reference.',
      link: text('Link', 'https://example.com'),
      linkText: text('Link Text', 'External Link'),
    },
    {
      id: 'uuid-2',
      created: new Date().toISOString(),
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
  recentSharedOutputs: createListResearchOutputResponse(
    number('Number of outputs', 5),
  ),
  recommendedUsers: createListUserResponse(3).items,
});

export const Normal = () => <DashboardPageBody {...props()} />;
