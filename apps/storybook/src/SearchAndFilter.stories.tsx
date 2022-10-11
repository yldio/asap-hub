import { text } from '@storybook/addon-knobs';

import { SearchAndFilter } from '@asap-hub/react-components';
import { action } from '@storybook/addon-actions';

export default {
  title: 'Organisms / Search and Filter',
  component: SearchAndFilter,
};

export const Normal = () => (
  <SearchAndFilter
    searchPlaceholder={text('Placeholder', 'Search for a protein, a method…')}
    onChangeSearch={() => action('Search')}
    searchQuery={text('Search Query', '')}
    filterOptions={[
      { title: 'TYPE OF OUTPUTS' },
      { label: 'Grant Document', value: '1' },
      { label: 'Dataset', value: '2' },
      { label: 'Bioinformatics', value: '3' },
      { label: 'Protocol', value: '4' },
      { label: 'Lab Resource', value: '5' },
      { label: 'Article', value: '7' },
      { label: 'Other', value: '8' },
    ]}
  />
);
