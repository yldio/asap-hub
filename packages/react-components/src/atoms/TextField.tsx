import { css } from '@emotion/react';
import { InputHTMLAttributes } from 'react';
import { ember, lead, paper, pine, rose, silver, steel, tin } from '../colors';
import {
  indicatorPadding,
  indicatorSize,
  paddingLeftRight,
  paddingTopBottom,
  styles,
  useValidation,
  validationMessageStyles,
} from '../form';
import { perRem } from '../pixels';
import { getSvgAspectRatio, noop } from '../utils';

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

const getIndicatorPadding = (icon: React.ReactElement) => {
  const aspectRatio = getSvgAspectRatio(icon);
  return `${
    (paddingLeftRight + indicatorSize * aspectRatio + indicatorPadding) / perRem
  }em`;
};

const getIndicatorStyles = (aspectRatio: number, position: Position) =>
  css({
    position: 'absolute',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',

    top: `${paddingTopBottom / perRem}em`,
    [position]: `${paddingLeftRight / perRem}em`,

    height: `${indicatorSize / perRem}em`,
    width: `${(indicatorSize * aspectRatio) / perRem}em`,
  });

type TextFieldProps = {
  readonly type?: FieldType;
  readonly enabled?: boolean;

  readonly customValidationMessage?: string;

  readonly leftIndicator?: React.ReactElement;
  readonly rightIndicator?: React.ReactElement;

  readonly labelIndicator?: React.ReactElement | string;
  readonly getValidationMessage?: Parameters<typeof useValidation>[1];

  readonly value: string;
  readonly onChange?: (newValue: string) => void;
} & Pick<
  InputHTMLAttributes<HTMLInputElement>,
  'id' | 'placeholder' | 'required' | 'maxLength' | 'pattern' | 'max'
>;
const TextField: React.FC<TextFieldProps> = ({
  type = 'text',
  enabled = true,

  required,
  maxLength,
  max,
  pattern,

  customValidationMessage = '',

  leftIndicator,
  rightIndicator,

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

  return (
    <div css={containerStyles}>
      <input
        {...props}
        {...validationTargetProps}
        type={type}
        disabled={!enabled}
        required={required}
        maxLength={maxLength}
        max={max}
        pattern={pattern}
        value={value}
        onChange={({ currentTarget: { value: newValue } }) =>
          onChange(newValue)
        }
        css={[
          styles,
          textFieldStyles,
          enabled || disabledStyles,

          validationMessage && invalidStyles,
          !labelIndicator && { gridColumn: '1 / span 2' },

          leftIndicator && {
            paddingLeft: getIndicatorPadding(leftIndicator),
          },

          rightIndicator && {
            paddingRight: getIndicatorPadding(rightIndicator),
          },
        ]}
      />

      {labelIndicator && (
        <div className={LABEL_INDICATOR_CLASS_NAME} css={labelIndicatorStyles}>
          {labelIndicator}
        </div>
      )}

      {leftIndicator && (
        <div css={getIndicatorStyles(getSvgAspectRatio(leftIndicator), 'left')}>
          {leftIndicator}
        </div>
      )}

      {rightIndicator && (
        <div
          css={getIndicatorStyles(getSvgAspectRatio(rightIndicator), 'right')}
        >
          {rightIndicator}
        </div>
      )}

      <div css={[validationMessageStyles, { gridColumn: '1 / span 2' }]}>
        {validationMessage}
      </div>
    </div>
  );
};

export default TextField;
