import React from 'react';
import { LibraryPageHeader } from '@asap-hub/react-components';
import { action } from '@storybook/addon-actions';
import { text } from '@storybook/addon-knobs';

import { NoPaddingDecorator } from './decorators';

export default {
  title: 'Templates / Library / Header',
  decorators: [NoPaddingDecorator],
};

export const Normal = () => (
  <LibraryPageHeader
    searchQuery={text('Search Query', '')}
    onChangeSearch={() => action('Search change')}
    filters={new Set()}
    onChangeFilter={() => action('Filter change')}
  />
);
