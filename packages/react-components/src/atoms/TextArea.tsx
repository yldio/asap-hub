import React, { InputHTMLAttributes } from 'react';
import css from '@emotion/css';

import { useValidation, styles, validationMessageStyles } from '../form';
import { noop } from '../utils';
import { ember, rose, fern, tin } from '../colors';

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

  '::placeholder': {
    color: tin.rgb,
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
  readonly id?: string;

  readonly customValidationMessage?: string;

  readonly value: string;
  readonly onChange?: (newValue: string) => void;
} & Pick<
  InputHTMLAttributes<HTMLTextAreaElement>,
  'id' | 'placeholder' | 'required' | 'maxLength'
>;
const TextArea: React.FC<TextAreaProps> = ({
  required,
  maxLength,

  customValidationMessage = '',

  value,
  onChange = noop,

  ...props
}) => {
  const { validationMessage, validationTargetProps } = useValidation<
    HTMLTextAreaElement
  >(customValidationMessage);

  const reachedMaxLength =
    value.length >= (maxLength ?? Number.POSITIVE_INFINITY);

  return (
    <div css={containerStyles}>
      <textarea
        {...props}
        {...validationTargetProps}
        rows={5}
        required={required}
        maxLength={maxLength}
        value={value}
        onChange={({ currentTarget: { value: newValue } }) =>
          onChange(newValue)
        }
        css={[styles, textareaStyles, validationMessage && invalidStyles]}
      />
      <div css={validationAndLimitStyles}>
        <div css={validationMessageStyles}>
          {validationMessage || (reachedMaxLength && 'Character count reached')}
        </div>
        {maxLength !== undefined && (
          <div
            css={[
              validationMessageStyles,
              limitStyles,
              { color: reachedMaxLength ? ember.rgb : fern.rgb },
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
