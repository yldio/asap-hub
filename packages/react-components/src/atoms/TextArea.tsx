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

    '~ div:last-of-type': {
      display: 'block',
    },
  },
});

const validationAndLimitStyles = css({
  display: 'grid',
  gridTemplateColumns: 'auto max-content',
});
const limitStyles = css({
  textAlign: 'right',
  fontWeight: 'bold',
});

type TextAreaProps = {
  readonly enabled?: boolean;

  readonly customValidationMessage?: string;
  readonly getValidationMessage?: Parameters<typeof useValidation>[1];

  readonly value: string;
  readonly onChange?: (newValue: string) => void;
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
        css={({ components }) => [
          styles,
          textareaStyles,
          enabled || disabledStyles,
          validationMessage && invalidStyles,
          {
            ':focus': {
              borderColor: components?.textArea?.focusStyles.borderColor.rgba,
            },
          },
        ]}
      />
      <div css={validationAndLimitStyles}>
        <div css={validationMessageStyles}>
          {validationMessage || (reachedMaxLength && 'Character count reached')}
        </div>
        {maxLength !== undefined && (
          <div
            css={({ components }) => [
              validationMessageStyles,
              limitStyles,
              { color: reachedMaxLength ? ember.rgb : fern.rgb },
              {
                color: reachedMaxLength
                  ? ember.rgb
                  : components?.textArea?.maxLengthStyles.color.rgba,
              },
            ]}
          >
            {value.length}/{maxLength}
          </div>
        )}
      </div>
    </div>
  );
};

export default TextArea;
