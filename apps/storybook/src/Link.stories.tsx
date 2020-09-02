import React from 'react';
import { text } from '@storybook/addon-knobs';
import {
  Link as LinkText,
  Paragraph as ParagraphText,
  ThemeVariant,
} from '@asap-hub/react-components';
import { Story } from '@storybook/react';

import { ThemeDecorator } from './decorators';

export default {
  title: 'Atoms / Link',
  decorators: [ThemeDecorator],
};

export const Link: Story<{ theme: ThemeVariant }> = (_, { theme }) => {
  return (
    <ParagraphText>
      <LinkText
        href={text('Destination', 'https://www.parkinsonsroadmap.org/')}
        theme={theme}
      >
        {text('Text', "Aligning Science Across Parkinson's")}
      </LinkText>
    </ParagraphText>
  );
};
