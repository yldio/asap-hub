import { NewsSection } from '@asap-hub/react-components';
import { ComponentProps } from 'react';
import { text } from '@storybook/addon-knobs';

export default {
  title: 'Organisms / Dashboard / News Section',
  component: NewsSection,
};

const props = (): ComponentProps<typeof NewsSection> => ({
  title: 'Latest News',
  subtitle: 'Explore the latest shared research and learn more about them.',
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
  ],
});

export const Normal = () => <NewsSection {...props()} />;
