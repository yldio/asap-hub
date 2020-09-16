import React, { ComponentProps } from 'react';
import css from '@emotion/css';

import { TextField } from '../atoms';
import { perRem } from '../pixels';
import { searchIcon } from '../icons';

const containerStyles = css({
  paddingBottom: `${18 / perRem}em`,
});

type SearchFieldProps = {} & Exclude<ComponentProps<typeof TextField>, 'id'>;
const SearchField: React.FC<SearchFieldProps> = (textFieldProps) => (
  <div css={containerStyles}>
    <TextField
      {...textFieldProps}
      customIndicator={searchIcon}
      customIndicatorPosition="left"
    />
  </div>
);

export default SearchField;
