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
    filterTitle={text('Filter Title', 'TYPE OF OUTPUTS')}
    filterOptions={[
      { label: 'Proposal', value: '1' },
      { label: 'Dataset', value: '2', disabled: true },
      { label: 'Software', value: '3', disabled: true },
      { label: 'Protocol', value: '4', disabled: true },
      { label: 'Lab Resource', value: '5', disabled: true },
      { label: 'Preprint', value: '6', disabled: true },
      { label: 'Article', value: '7', disabled: true },
      { label: 'Other', value: '8', disabled: true },
    ]}
  />
);
