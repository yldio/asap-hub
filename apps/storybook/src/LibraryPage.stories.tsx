import React from 'react';
import { LibraryPage } from '@asap-hub/react-components';
import { action } from '@storybook/addon-actions';
import { text } from '@storybook/addon-knobs';

import { LayoutDecorator } from './decorators';

export default {
  title: 'Pages / Library',
  decorators: [LayoutDecorator],
};

export const LibraryList = () => (
  <LibraryPage
    query={text('Query', '')}
    onChangeSearch={() => action('search change')}
  />
);
