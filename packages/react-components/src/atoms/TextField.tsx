import React, { InputHTMLAttributes, useState } from 'react';
import css from '@emotion/css';
import { useDebounce } from 'use-debounce';

import { perRem } from '../pixels';
import { lead, silver, ember, rose, tin, pine } from '../colors';
import { noop, getSvgAspectRatio } from '../utils';
import { loadingImage, validTickGreenImage } from '../images';
import { useGifReplay } from '../hooks';
import {
  useValidation,
  styles,
  paddingTopBottom,
  paddingLeftRight,
  indicatorSize,
  indicatorPadding,
  validationMessageStyles,
} from '../form';

type Position = 'left' | 'right';
type FieldType =
  | 'text'
  | 'search'
  | 'email'
  | 'tel'
  | 'url'
  | 'password'
  | 'date';

const disabledStyles = css({
  color: lead.rgb,
  backgroundColor: silver.rgb,
});

const customIndicatorPadding = (aspectRatio: number, position: Position) => {
  const padding = `${
    (paddingLeftRight + indicatorSize * aspectRatio + indicatorPadding) / perRem
  }em`;
  return position === 'right'
    ? css({
        paddingRight: padding,
      })
    : css({
        paddingLeft: padding,
      });
};

const loadingStyles = css({
  paddingRight: `${
    (paddingLeftRight + indicatorSize + indicatorPadding) / perRem
  }em`,
  backgroundImage: `url(${loadingImage})`,
});
const validStyles = (gifUrl: string) =>
  css({
    ':valid': {
      paddingRight: `${
        (paddingLeftRight + indicatorSize + indicatorPadding) / perRem
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

const textFieldStyles = css({
  backgroundPosition: `right ${paddingLeftRight / perRem}em top ${
    paddingTopBottom / perRem
  }em`,
  backgroundRepeat: 'no-repeat',
  backgroundSize: `auto ${indicatorSize / perRem}em`,

  '::placeholder': {
    color: tin.rgb,
  },

  // see invalid
  '~ div:last-of-type': {
    display: 'none',
  },
  '~ div svg': {
    stroke: lead.rgb,
  },
  ':focus ~ div svg': {
    stroke: pine.rgb,
  },
});
const containerStyles = css({
  flexBasis: '100%',
  position: 'relative',
});
const customIndicatorStyles = (aspectRatio: number, position: Position) =>
  css({
    position: 'absolute',

    top: `${paddingTopBottom / perRem}em`,
    [position]: `${paddingLeftRight / perRem}em`,

    height: `${indicatorSize / perRem}em`,
    width: `${(indicatorSize * aspectRatio) / perRem}em`,
  });

const showValidationType: Set<FieldType> = new Set([
  'date',
  'email',
  'tel',
  'url',
]);

type TextFieldProps = {
  readonly type?: FieldType;
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
  readonly customIndicatorPosition?: Position;

  readonly value: string;
  readonly onChange?: (newValue: string) => void;
} & Pick<
  InputHTMLAttributes<HTMLInputElement>,
  'id' | 'placeholder' | 'required' | 'maxLength' | 'pattern'
>;
const TextField: React.FC<TextFieldProps> = ({
  type = 'text',
  enabled = true,

  required,
  maxLength,
  pattern,

  customValidationMessage = '',

  customIndicator,
  customIndicatorPosition = 'right',
  loading = false,
  indicateValid = customIndicator === undefined &&
    (pattern !== undefined || showValidationType.has(type)),

  value,
  onChange = noop,

  ...props
}) => {
  const { validationMessage, validationTargetProps } = useValidation<
    HTMLInputElement
  >(customValidationMessage);

  const validGifUrl = useGifReplay(validTickGreenImage, [indicateValid, value]);
  const [debouncedValue] = useDebounce(value, 500);
  const [isDirty, setIsDirty] = useState(false);
  const debouncedIndicateValid =
    isDirty && indicateValid && value === debouncedValue;
  return (
    <div css={containerStyles}>
      <input
        {...props}
        {...validationTargetProps}
        type={type}
        disabled={!enabled}
        required={required}
        maxLength={maxLength}
        pattern={pattern}
        value={value}
        onChange={({ currentTarget: { value: newValue } }) => {
          setIsDirty(true);
          return onChange(newValue);
        }}
        css={[
          styles,
          textFieldStyles,
          enabled || disabledStyles,

          debouncedIndicateValid && validStyles(validGifUrl),
          validationMessage && invalidStyles,

          customIndicator &&
            customIndicatorPadding(
              getSvgAspectRatio(customIndicator),
              customIndicatorPosition,
            ),
          loading && loadingStyles,
        ]}
      />
      {customIndicator && (
        <div
          css={customIndicatorStyles(
            getSvgAspectRatio(customIndicator),
            customIndicatorPosition,
          )}
        >
          {customIndicator}
        </div>
      )}
      <div css={validationMessageStyles}>{validationMessage}</div>
    </div>
  );
};

export default TextField;
