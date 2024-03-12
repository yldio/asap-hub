import { SearchField } from '@asap-hub/react-components';

import { text } from './knobs';

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
