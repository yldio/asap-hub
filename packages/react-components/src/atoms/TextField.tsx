import React, { InputHTMLAttributes, useState, useEffect, useRef } from 'react';
import css from '@emotion/css';
import { useDebounce } from 'use-debounce';

import { perRem } from '../pixels';
import { steel, fern, lead, silver, ember, rose, tin } from '../colors';
import { noop } from '../utils';
import { loadingImage, validTickGreenImage } from '../images';
import { useGifReplay } from '../hooks';

const borderWidth = 1;
const padding = 15;
const lineHeight = 24;
const iconSize = lineHeight;
const iconPadding = padding;

const disabledStyles = css({
  color: lead.rgb,
  backgroundColor: silver.rgb,
});

const loadingStyles = css({
  paddingRight: `${(padding + iconSize + iconPadding) / perRem}em`,
  backgroundImage: `url(${loadingImage})`,
});
const validStyles = (gifUrl: string) =>
  css({
    ':valid': {
      paddingRight: `${(padding + iconSize + iconPadding) / perRem}em`,
      backgroundImage: `url(${gifUrl})`,
    },
  });
const invalidStyles = css({
  ':invalid': {
    color: ember.rgb,
    borderColor: ember.rgb,
    backgroundColor: rose.rgb,

    '+ div': {
      display: 'block',
    },
  },
});

const styles = css({
  boxSizing: 'border-box',
  width: '100%',
  padding: `${padding / perRem}em`,

  lineHeight: `${lineHeight / perRem}em`,

  '::placeholder': {
    color: tin.rgb,
  },

  outline: 'none',

  borderStyle: 'solid',
  borderWidth: `${borderWidth / perRem}em`,
  borderColor: steel.rgb,
  ':focus': {
    borderColor: fern.rgb,
  },

  backgroundPosition: `right ${padding / perRem}em center`,
  backgroundRepeat: 'no-repeat',
  backgroundSize: `${iconSize / perRem}em`,

  '+ div': {
    display: 'none',
  },
});

const validationMessageStyles = css({
  paddingTop: `${6 / perRem}em`,
  paddingBottom: `${6 / perRem}em`,

  color: ember.rgb,
});

type TextFieldProps = {
  type?:
    | 'text'
    | 'search'
    | 'email'
    | 'tel'
    | 'url'
    | /* TODO advanced PW field */ 'password';
  enabled?: boolean;

  /**
   * By default, a valid text field only shows an indicator
   * if one of the input validation attributes is set
   * to avoid polluting fields that do not have validation at all with indicators.
   * However, if custom validity checking is used, this can be used
   * to show an indicator despite no validation attributes being set.
   */
  indicateValid?: boolean;
  customValidationMessage?: string;
  loading?: boolean;

  value: string;
  onChange?: (newValue: string) => void;
} & Pick<
  InputHTMLAttributes<HTMLInputElement>,
  'placeholder' | 'required' | 'minLength' | 'maxLength' | 'pattern'
>;
const TextField: React.FC<TextFieldProps> = ({
  type = 'text',
  enabled = true,
  required,
  minLength,
  maxLength,
  pattern,

  customValidationMessage = '',
  indicateValid = !!customValidationMessage ||
    required !== undefined ||
    minLength !== undefined ||
    maxLength !== undefined ||
    pattern !== undefined,
  loading = false,

  value,
  onChange = noop,

  ...props
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [validationMessage, setValidationMessage] = useState('');
  useEffect(() => {
    const input = inputRef.current!; // eslint-disable-line @typescript-eslint/no-non-null-assertion
    input.setCustomValidity(customValidationMessage);

    // If the invalidity has already been surfaced, make sure the message is updated
    if (validationMessage) {
      input.reportValidity();
    }

    return () => input.setCustomValidity('');
  }, [customValidationMessage, validationMessage]);

  const validGifUrl = useGifReplay(validTickGreenImage, [indicateValid, value]);
  const [debouncedValue] = useDebounce(value, 500);
  const debouncedIndicateValid = indicateValid && value === debouncedValue;

  return (
    <>
      <input
        {...props}
        ref={inputRef}
        type={type}
        disabled={!enabled}
        required={required}
        minLength={minLength}
        maxLength={maxLength}
        pattern={pattern}
        value={value}
        onChange={({ currentTarget: { value: newValue } }) =>
          onChange(newValue)
        }
        onBlur={(event) =>
          setValidationMessage(event.currentTarget.validationMessage)
        }
        onInvalid={(event) => {
          setValidationMessage(event.currentTarget.validationMessage);
          event.preventDefault();
        }}
        css={[
          styles,
          enabled || disabledStyles,
          debouncedIndicateValid && validStyles(validGifUrl),
          validationMessage && invalidStyles,
          loading && loadingStyles,
        ]}
      />
      <div css={validationMessageStyles}>{validationMessage}</div>
    </>
  );
};

export default TextField;
