import React, { InputHTMLAttributes, useState, useEffect, useRef } from 'react';
import css from '@emotion/css';
import { useDebounce } from 'use-debounce';

import { perRem } from '../pixels';
import { steel, fern, lead, silver, ember, rose, tin } from '../colors';
import { noop, getSvgAspectRatio } from '../utils';
import { loadingImage, validTickGreenImage } from '../images';
import { useGifReplay } from '../hooks';

const borderWidth = 1;

const padding = 15;
const indicatorPadding = padding;

const textPaddingTop = padding + 1;
const textPaddingBottom = padding - 1;

const lineHeight = 24;
const indicatorHeight = lineHeight;

const disabledStyles = css({
  color: lead.rgb,
  backgroundColor: silver.rgb,
});

const customIndicatorPadding = (aspectRatio: number) =>
  css({
    paddingRight: `${
      (padding + indicatorHeight * aspectRatio + indicatorPadding) / perRem
    }em`,
  });
const loadingStyles = css({
  paddingRight: `${(padding + indicatorHeight + indicatorPadding) / perRem}em`,
  backgroundImage: `url(${loadingImage})`,
});
const validStyles = (gifUrl: string) =>
  css({
    ':valid': {
      paddingRight: `${
        (padding + indicatorHeight + indicatorPadding) / perRem
      }em`,
      backgroundImage: `url(${gifUrl})`,
    },
  });
const invalidStyles = css({
  ':invalid': {
    color: ember.rgb,
    borderColor: ember.rgb,
    backgroundColor: rose.rgb,

    '~ div:last-of-type': {
      display: 'block',
    },
    '~ div': {
      color: ember.rgb,
    },
    '~ div svg': {
      fill: ember.rgb,
    },
  },
});

const styles = css({
  boxSizing: 'border-box',
  width: '100%',
  paddingLeft: `${padding / perRem}em`,
  paddingRight: `${padding / perRem}em`,
  paddingTop: `${textPaddingTop / perRem}em`,
  paddingBottom: `${textPaddingBottom / perRem}em`,

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

  backgroundPosition: `right ${padding / perRem}em top ${padding / perRem}em`,
  backgroundRepeat: 'no-repeat',
  backgroundSize: `auto ${indicatorHeight / perRem}em`,

  '~ div:last-of-type': {
    display: 'none',
  },
});

const containerStyles = css({
  position: 'relative',
});
const customIndicatorStyles = (aspectRatio: number) =>
  css({
    position: 'absolute',

    top: `${padding / perRem}em`,
    right: `${padding / perRem}em`,

    height: `${indicatorHeight / perRem}em`,
    width: `${(indicatorHeight * aspectRatio) / perRem}em`,
  });
const validationMessageStyles = css({
  paddingTop: `${6 / perRem}em`,
  paddingBottom: `${6 / perRem}em`,
});

type TextFieldProps = {
  readonly type?: 'text' | 'search' | 'email' | 'tel' | 'url' | 'password';
  readonly enabled?: boolean;

  /**
   * By default, a valid text field only shows an indicator
   * if one of the input validation attributes is set
   * to avoid polluting fields that do not have validation at all with indicators.
   * However, if custom validity checking is used, this can be used
   * to show an indicator despite no validation attributes being set.
   */
  readonly indicateValid?: boolean;
  readonly customValidationMessage?: string;

  readonly loading?: boolean;
  readonly customIndicator?: React.ReactElement;

  readonly value: string;
  readonly onChange?: (newValue: string) => void;
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
  indicateValid = required !== undefined ||
    minLength !== undefined ||
    maxLength !== undefined ||
    pattern !== undefined,

  loading = false,
  customIndicator,

  value,
  onChange = noop,

  ...props
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [validationMessage, setValidationMessage] = useState('');
  useEffect(() => {
    const input = inputRef.current!; // eslint-disable-line @typescript-eslint/no-non-null-assertion
    input.setCustomValidity(customValidationMessage);

    if (validationMessage || customValidationMessage) {
      input.reportValidity();
    }

    return () => input.setCustomValidity('');
  }, [customValidationMessage, validationMessage]);

  const validGifUrl = useGifReplay(validTickGreenImage, [indicateValid, value]);
  const [debouncedValue] = useDebounce(value, 500);
  const debouncedIndicateValid = indicateValid && value === debouncedValue;

  return (
    <div css={containerStyles}>
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

          customIndicator &&
            customIndicatorPadding(getSvgAspectRatio(customIndicator)),
          loading && loadingStyles,
        ]}
      />
      {customIndicator && (
        <div css={customIndicatorStyles(getSvgAspectRatio(customIndicator))}>
          {customIndicator}
        </div>
      )}
      <div css={validationMessageStyles}>{validationMessage}</div>
    </div>
  );
};

export default TextField;
