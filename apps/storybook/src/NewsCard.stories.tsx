import { boolean, text } from '@storybook/addon-knobs';

import { NewsCard } from '@asap-hub/react-components';
import { ComponentProps } from 'react';

export default {
  title: 'Organisms / News / Card',
};

const newsProps = (): ComponentProps<typeof NewsCard> => ({
  id: 'uuid-1',
  created: new Date().toISOString(),
  type: 'News' as const,
  title: text(
    'Title',
    "Coordinating different research interests into Parkinson's",
  ),
  link: text('External Link', 'https://picsum.photos/200'),
  linkText: text('External Link Text', 'Read More'),
  shortText: text(
    'Short Text',
    'Point of view from ASAP scientific director, Randy Schekman, PhD and managing director, Ekemini A. U. Riley, PhD.',
  ),
  thumbnail: text('Thumbnail', 'https://picsum.photos/200'),
  noPill: boolean('No Pill', false),
});

const tutorialProps = (): ComponentProps<typeof NewsCard> => ({
  id: 'uuid-2',
  created: new Date().toISOString(),
  type: 'Tutorial' as const,
  title: text(
    'Title',
    'Welcome to the ASAP Collaborative Initiative: The Science & the scientists',
  ),
  thumbnail: text('Thumbnail', 'https://picsum.photos/200'),
});

export const News = () => <NewsCard {...newsProps()} />;

export const Tutorial = () => <NewsCard {...tutorialProps()} />;
