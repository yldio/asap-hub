import React from 'react';
import { WhereToStartSection } from '@asap-hub/react-components';
import { number } from '@storybook/addon-knobs';

export default {
  title: 'Organisms / Dashboard / Where To Start',
};

export const Normal = () => (
  <WhereToStartSection
    pages={Array.from(
      { length: number('Number of Pages', 2, { min: 0 }) },
      (_, idx) => ({
        path: '/path',
        title: `This is the Title for Page ${idx}`,
        text: `This is the text for Page ${idx}. It can be a long form text and it's up to you to right it.`,
      }),
    )}
  />
);
