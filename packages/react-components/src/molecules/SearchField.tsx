import React, { ComponentProps, useEffect } from 'react';
import { useDebounce } from 'use-debounce';

import {
  SEARCH_EVENT,
  SEARCH_PLACEHOLDER_KEY,
  SEARCH_QUERY_KEY,
} from '../analytics';
import { TextField } from '../atoms';
import { searchIcon } from '../icons';
import { perRem } from '../pixels';

type SearchProps = Pick<
  ComponentProps<typeof TextField>,
  'value' | 'onChange'
> &
  Required<Pick<ComponentProps<typeof TextField>, 'placeholder'>>;
const SearchField: React.FC<SearchProps> = (props) => {
  const [debouncedValue] = useDebounce(props.value, 5000);

  useEffect(() => {
    if (props.value && props.value === debouncedValue) {
      window.dataLayer?.push({
        [SEARCH_QUERY_KEY]: props.value,
        [SEARCH_PLACEHOLDER_KEY]: props.placeholder,
        event: SEARCH_EVENT,
      });
    }

    return () => {
      window.dataLayer?.push({
        [SEARCH_QUERY_KEY]: undefined,
        [SEARCH_PLACEHOLDER_KEY]: undefined,
      });
    };
  }, [debouncedValue, props.placeholder, props.value]);

  return (
    <div css={{ padding: `${18 / perRem}em 0` }}>
      <TextField
        {...props}
        type="search"
        customIndicator={searchIcon}
        customIndicatorPosition="left"
      />
    </div>
  );
};

export default SearchField;
