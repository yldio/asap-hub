import React from 'react';
import { SharedResearchPageHeader } from '@asap-hub/react-components';
import { action } from '@storybook/addon-actions';
import { text } from '@storybook/addon-knobs';

import { NoPaddingDecorator } from './layout';

export default {
  title: 'Templates / Shared Research / Header',
  decorators: [NoPaddingDecorator],
};

export const Normal = () => (
  <SharedResearchPageHeader
    searchQuery={text('Search Query', '')}
    onChangeSearch={() => action('Search change')}
    filters={new Set()}
    onChangeFilter={() => action('Filter change')}
  />
);
