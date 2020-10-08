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
      { label: 'Dataset', value: '2', enabled: false },
      { label: 'Software', value: '3', enabled: false },
      { label: 'Protocol', value: '4', enabled: false },
      { label: 'Lab Resource', value: '5', enabled: false },
      { label: 'Preprint', value: '6', enabled: false },
      { label: 'Article', value: '7', enabled: false },
      { label: 'Other', value: '8', enabled: false },
    ]}
  />
);
