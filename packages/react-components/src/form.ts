import {
  useState,
  useEffect,
  useRef,
  FocusEvent,
  FormEvent,
  HTMLProps,
} from 'react';
import { fern, steel, ember, pine, lead } from './colors';
import { perRem, lineHeight } from './pixels';

export const borderWidth = 1;

export const paddingLeftRight = 18;
export const paddingTopBottom = 15;
export const indicatorPadding = 8;

export const textPaddingTop = paddingTopBottom + 1;
export const textPaddingBottom = paddingTopBottom - 1;

export const indicatorSize = lineHeight;

export const styles = {
  boxSizing: 'border-box',
  width: '100%',
  paddingLeft: `${paddingLeftRight / perRem}em`,
  paddingRight: `${paddingLeftRight / perRem}em`,
  paddingTop: `${textPaddingTop / perRem}em`,
  paddingBottom: `${textPaddingBottom / perRem}em`,

  lineHeight: `${lineHeight / perRem}em`,

  backgroundColor: 'unset',

  outline: 'none',

  borderStyle: 'solid',
  borderWidth: `${borderWidth / perRem}em`,
  borderColor: steel.rgb,
  ':focus': {
    borderColor: fern.rgb,
  },
  ' ~ div svg': {
    stroke: lead.rgb,
  },
  ':focus ~ div svg': {
    stroke: pine.rgb,
  },
} as const;
export const validationMessageStyles = {
  ':empty': {
    display: 'none',
  },
  paddingTop: `${6 / perRem}em`,
  paddingBottom: `${6 / perRem}em`,

  color: ember.rgb,
  borderColor: ember.rgb,
} as const;

type ValidationTarget =
  | HTMLInputElement
  | HTMLTextAreaElement
  | HTMLSelectElement;
export function useValidation<T extends ValidationTarget>(
  customValidationMessage: string,
): {
  validationMessage: string;
  validationTargetProps: Pick<HTMLProps<T>, 'ref' | 'onBlur' | 'onInvalid'>;
} {
  const inputRef = useRef<T>(null);
  const [validationMessage, setValidationMessage] = useState('');
  useEffect(() => {
    const input = inputRef.current!; // eslint-disable-line @typescript-eslint/no-non-null-assertion
    input.setCustomValidity(customValidationMessage);

    if (validationMessage || customValidationMessage) {
      input.reportValidity();
    }

    return () => input.setCustomValidity('');
  }, [customValidationMessage, validationMessage]);

  return {
    validationMessage,
    validationTargetProps: {
      ref: inputRef,
      onBlur: (event: FocusEvent<ValidationTarget>) =>
        setValidationMessage(event.currentTarget.validationMessage),
      onInvalid: (event: FormEvent<ValidationTarget>) => {
        setValidationMessage(event.currentTarget.validationMessage);
        event.preventDefault();
      },
    },
  };
}
