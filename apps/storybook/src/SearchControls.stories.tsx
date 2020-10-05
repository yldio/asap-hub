import React from 'react';
import { text } from '@storybook/addon-knobs';

import { SearchControls } from '@asap-hub/react-components';
import { action } from '@storybook/addon-actions';

export default {
  title: 'Organisms / Search Controls',
  component: SearchControls,
};

export const Normal = () => (
  <SearchControls
    placeholder={text('Placeholder', 'Search for a protein, a method…')}
    onChangeSearch={() => action('Search')}
    query={text('Query', '')}
  />
);
