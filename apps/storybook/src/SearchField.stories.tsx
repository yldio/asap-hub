import React from 'react';
import { text } from '@storybook/addon-knobs';

import { SearchField } from '@asap-hub/react-components';

export default {
  title: 'Molecules / Search Field',
  component: SearchField,
};

export const Normal = () => (
  <SearchField
    value={text('Value', '')}
    placeholder={text('Placeholder', 'Search for someone…')}
  />
);
