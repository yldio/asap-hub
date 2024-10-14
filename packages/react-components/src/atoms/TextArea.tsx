/** @jsxImportSource @emotion/react */
import { InputHTMLAttributes } from 'react';
import { css } from '@emotion/react';

import { useValidation, styles, validationMessageStyles } from '../form';
import { noop } from '../utils';
import { ember, rose, fern, tin, lead, silver } from '../colors';
import { perRem, tabletScreen } from '../pixels';

const containerStyles = css({
  flexBasis: '100%',

  // see invalid
  '~ div:last-of-type': {
    display: 'none',
  },
});
const textareaStyles = css({
  display: 'block',
  resize: 'vertical',

  boxSizing: 'border-box',
  height: `${318 / perRem}em`,
  [`@media (min-width: ${tabletScreen.min}px)`]: {
    height: `${150 / perRem}em`,
  },

  '::placeholder': {
    color: tin.rgb,
  },
});
const disabledStyles = css({
  color: lead.rgb,
  backgroundColor: silver.rgb,
});
const invalidStyles = css({
  ':invalid': {
    color: ember.rgb,
    borderColor: ember.rgb,
    backgroundColor: rose.rgb,

    '::placeholder': {
      color: ember.rgb,
      opacity: 0.4,
    },
    '~ div:last-of-type': {
      display: 'block',
    },
  },
});

const limitStyles = css({
  textAlign: 'right',
  fontWeight: 'bold',
});

const limitAndExtrasStyles = css({
  display: 'flex',
  justifyContent: 'space-between',
  paddingTop: `${16 / perRem}em`,
});

type TextAreaProps = {
  readonly enabled?: boolean;

  readonly customValidationMessage?: string;
  readonly getValidationMessage?: Parameters<typeof useValidation>[1];

  readonly value: string;
  readonly onChange?: (newValue: string) => void;
  readonly onBlur?: (newValue: string) => void;

  readonly extras?: React.ReactNode;
} & Pick<
  InputHTMLAttributes<HTMLTextAreaElement>,
  'id' | 'placeholder' | 'required' | 'maxLength'
>;
const TextArea: React.FC<TextAreaProps> = ({
  enabled = true,

  required,
  maxLength,

  customValidationMessage = '',
  getValidationMessage,

  value,
  onChange = noop,
  onBlur = noop,

  extras,

  ...props
}) => {
  const { validationMessage, validationTargetProps } =
    useValidation<HTMLTextAreaElement>(
      customValidationMessage,
      getValidationMessage,
    );

  const reachedMaxLength =
    value.length >= (maxLength ?? Number.POSITIVE_INFINITY);

  return (
    <div css={containerStyles}>
      <textarea
        {...props}
        {...validationTargetProps}
        disabled={!enabled}
        required={required}
        maxLength={maxLength}
        value={value}
        onChange={({ currentTarget: { value: newValue } }) =>
          onChange(newValue)
        }
        onBlur={({ currentTarget: { value: newValue } }) => onBlur(newValue)}
        css={({ colors }) => [
          styles,
          textareaStyles,
          enabled || disabledStyles,
          validationMessage && invalidStyles,
          colors?.primary500 && {
            ':focus': {
              borderColor: colors?.primary500.rgba,
            },
          },
        ]}
      />
      <div>
        <div css={validationMessageStyles}>
          {validationMessage || (reachedMaxLength && 'Character count reached')}
        </div>
        <div css={limitAndExtrasStyles}>
          <div>{extras}</div>
          {maxLength !== undefined && (
            <div
              css={({ colors: { primary500 = fern } = {} }) => [
                validationMessageStyles,
                limitStyles,
                { color: reachedMaxLength ? ember.rgb : primary500.rgba },
              ]}
            >
              {value.length}/{maxLength}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TextArea;
