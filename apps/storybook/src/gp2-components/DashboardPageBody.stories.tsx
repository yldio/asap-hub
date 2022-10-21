import { DashboardPageBody } from '@asap-hub/gp2-components';
import { text } from '@storybook/addon-knobs';

export default {
  title: 'GP2 / Templates / Dashboard Page Body',
  component: DashboardPageBody,
};

const props = {
  news: [
    {
      id: 'uuid-1',
      created: new Date().toISOString(),
      type: 'News' as const,
      title: 'Learn about Protocols.io, an ASAP preferred tool',
      shortText:
        'Discover current and planned tools (e.g., animal & cell models, antibodies, vectors, tissues, etc.) in a sortable table. This will be a living reference.',
      link: text('Link', 'https://example.com'),
      linkText: text('Link Text', 'External Link'),
    },
    {
      id: 'uuid-2',
      created: new Date().toISOString(),
      type: 'Tutorial' as const,
      title:
        'Welcome to the ASAP Collaborative Initiative: The Science & the scientists',
    },
  ],
  pages: [],
  userId: 'u42',
};

// WIP
export const Normal = () => <DashboardPageBody {...props} />;
