import { InputHTMLAttributes, useState } from 'react';
import { css } from '@emotion/react';
import { useDebounce } from 'use-debounce';

import { perRem } from '../pixels';
import { lead, silver, ember, rose, tin, pine, steel, paper } from '../colors';
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
const LABEL_INDICATOR_CLASS_NAME = 'labelIndicator';
const labelIndicatorStyles = css({
  padding: `${15 / perRem}em ${18 / perRem}em`,
  backgroundColor: silver.rgb,
  border: `1px solid ${steel.rgb}`,
  borderRight: 0,
  display: 'flex',
  color: lead.rgb,
  order: -1,
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
    [`& ~ .${LABEL_INDICATOR_CLASS_NAME}`]: {
      backgroundColor: ember.rgb,
      borderColor: ember.rgb,
      color: paper.rgb,
      svg: {
        stroke: paper.rgb,
        fill: 'none',
      },
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
  display: 'grid',
  gridTemplateColumns: 'max-content 1fr',
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
  readonly labelIndicator?: React.ReactElement | string;
  readonly getValidationMessage?: Parameters<typeof useValidation>[1];

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
  labelIndicator,

  getValidationMessage,

  value,
  onChange = noop,

  ...props
}) => {
  const { validationMessage, validationTargetProps } =
    useValidation<HTMLInputElement>(
      customValidationMessage,
      getValidationMessage,
    );

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
          !labelIndicator && { gridColumn: '1 / span 2' },
          customIndicator &&
            customIndicatorPadding(
              getSvgAspectRatio(customIndicator),
              customIndicatorPosition,
            ),
          loading && loadingStyles,
        ]}
      />
      {labelIndicator && (
        <div className={LABEL_INDICATOR_CLASS_NAME} css={labelIndicatorStyles}>
          {labelIndicator}
        </div>
      )}
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
      <div css={[validationMessageStyles, { gridColumn: '1 / span 2' }]}>
        {validationMessage}
      </div>
    </div>
  );
};

export default TextField;
