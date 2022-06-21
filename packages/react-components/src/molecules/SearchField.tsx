import { css } from '@emotion/react';
import { ComponentProps, useEffect } from 'react';
import { useDebounce } from 'use-debounce';
import {
  SEARCH_EVENT,
  SEARCH_PLACEHOLDER_KEY,
  SEARCH_QUERY_KEY,
} from '../analytics';
import { Button, TextField } from '../atoms';
import { crossIcon, searchIcon } from '../icons';
import { perRem } from '../pixels';

const clearButtonStyles = css({
  padding: `${18 / perRem}em 0`,
  // removing input's clear/cancel pseudo-element
  // from webkit based browsers
  'input[type="search"]::-webkit-search-cancel-button': {
    appearance: 'none',
  },
  // and from IE
  'input[type=text]::-ms-clear': { display: 'none', width: 0, height: 0 },
});

const rightIndicatorStyles = css({
  button: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
const MAX_ALGOLIA_QUERY_LENGTH = 512;

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
    <div css={clearButtonStyles}>
      <TextField
        {...props}
        maxLength={MAX_ALGOLIA_QUERY_LENGTH}
        type="search"
        leftIndicator={searchIcon}
        rightIndicator={
          props.value ? (
            <div css={rightIndicatorStyles}>
              <Button
                linkStyle
                onClick={() => props.onChange && props.onChange('')}
              >
                {crossIcon}
              </Button>
            </div>
          ) : undefined
        }
      />
    </div>
  );
};

export default SearchField;
