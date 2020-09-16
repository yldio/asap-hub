import React, { ComponentProps } from 'react';

import { TextField } from '../atoms';
import { searchIcon } from '../icons';

type SearchProps = Pick<
  ComponentProps<typeof TextField>,
  'placeholder' | 'value' | 'onChange'
>;
const SearchField: React.FC<SearchProps> = (searchProps) => (
  <TextField
    {...searchProps}
    customIndicator={searchIcon}
    customIndicatorPosition="left"
  />
);

export default SearchField;
