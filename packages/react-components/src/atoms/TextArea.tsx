import React, { InputHTMLAttributes } from 'react';
import css from '@emotion/css';

import { useValidation, styles, validationMessageStyles } from '../form';
import { noop } from '../utils';
import { ember, rose } from '../colors';

const textareaStyles = css({
  display: 'block',
  resize: 'vertical',
});
const containerStyles = css({
  flexBasis: '100%',

  // see invalid
  '~ div:last-of-type': {
    display: 'none',
  },
});
const invalidStyles = {
  ':invalid': {
    color: ember.rgb,
    borderColor: ember.rgb,
    backgroundColor: rose.rgb,

    '~ div:last-of-type': {
      display: 'block',
    },
  },
};

type TextAreaProps = {
  readonly id?: string;

  readonly customValidationMessage?: string;

  readonly value: string;
  readonly onChange?: (newValue: string) => void;
} & Pick<
  InputHTMLAttributes<HTMLTextAreaElement>,
  'id' | 'placeholder' | 'required' | 'minLength' | 'maxLength'
>;
const TextArea: React.FC<TextAreaProps> = ({
  required,
  minLength,
  maxLength,

  customValidationMessage = '',

  value,
  onChange = noop,

  ...props
}) => {
  const { validationMessage, validationTargetProps } = useValidation<
    HTMLTextAreaElement
  >(customValidationMessage);

  return (
    <div css={containerStyles}>
      <textarea
        {...props}
        {...validationTargetProps}
        rows={5}
        required={required}
        minLength={minLength}
        maxLength={maxLength}
        value={value}
        onChange={({ currentTarget: { value: newValue } }) =>
          onChange(newValue)
        }
        css={[styles, textareaStyles, validationMessage && invalidStyles]}
      />
      <div css={validationMessageStyles}>{validationMessage}</div>
    </div>
  );
};

export default TextArea;
