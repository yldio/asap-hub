import React, { ComponentProps } from 'react';

import { TextField } from '../atoms';
import { searchIcon } from '../icons';
import { perRem } from '../pixels';

type SearchProps = Pick<
  ComponentProps<typeof TextField>,
  'placeholder' | 'value' | 'onChange'
>;
const SearchField: React.FC<SearchProps> = (searchProps) => (
  <div css={{ padding: `${18 / perRem}em 0` }}>
    <TextField
      {...searchProps}
      type="search"
      customIndicator={searchIcon}
      customIndicatorPosition="left"
    />
  </div>
);

export default SearchField;
