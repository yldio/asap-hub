import { ComponentProps } from 'react';
import { NewsPageBody } from '@asap-hub/react-components';

export default {
  title: 'Templates / News / Page Body',
};

const props = (): ComponentProps<typeof NewsPageBody> => ({
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
});

export const Normal = () => <NewsPageBody {...props()} />;
