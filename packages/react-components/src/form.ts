import {
  FocusEventHandler,
  FormEvent,
  FormEventHandler,
  MutableRefObject,
  useEffect,
  useRef,
  useState,
} from 'react';
import { ember, fern, steel } from './colors';
import { lineHeight, perRem } from './pixels';
import { themes } from './theme';

export const borderWidth = 1;

export const paddingLeftRight = 18;
export const paddingTopBottom = 15;
export const indicatorPadding = 8;

export const textPaddingTop = paddingTopBottom + 1;
export const textPaddingBottom = paddingTopBottom - 1;

export const indicatorSize = lineHeight;

export const styles = {
  ...themes.light,
  boxSizing: 'border-box',
  width: '100%',
  paddingLeft: `${paddingLeftRight / perRem}em`,
  paddingRight: `${paddingLeftRight / perRem}em`,
  paddingTop: `${textPaddingTop / perRem}em`,
  paddingBottom: `${textPaddingBottom / perRem}em`,

  lineHeight: `${lineHeight / perRem}em`,

  outline: 'none',

  borderStyle: 'solid',
  borderWidth: `${borderWidth / perRem}em`,
  borderColor: steel.rgb,
  ':focus': {
    borderColor: fern.rgb,
  },
} as const;

export const validationMessageStyles = {
  ':empty': {
    display: 'none',
  },
  whiteSpace: 'pre-wrap',

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
  getValidationMessage?: (validityState: ValidityState) => string | undefined,
): {
  validationMessage: string;
  validationTargetProps: {
    readonly onInvalid: FormEventHandler;
    readonly onBlur: FocusEventHandler;
    readonly ref: MutableRefObject<T | null>;
  };
  validate: () => void;
} {
  const inputRef = useRef<T>(null);
  const [validationMessage, setValidationMessage] = useState('');
  useEffect(() => {
    const input = inputRef.current!; // eslint-disable-line @typescript-eslint/no-non-null-assertion
    input.setCustomValidity(customValidationMessage);

    if (validationMessage || customValidationMessage) {
      setValidationMessage(customValidationMessage);
      input.reportValidity();
    }

    return () => input.setCustomValidity('');
  }, [customValidationMessage, validationMessage]);

  const validate = () => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const inputField = inputRef.current!;
    const inputFieldValidity = inputField.validity.valid;
    setValidationMessage(
      (getValidationMessage &&
        !inputFieldValidity &&
        getValidationMessage(inputField.validity)) ||
        inputField.validationMessage,
    );
  };
  return {
    validate,
    validationMessage,
    validationTargetProps: {
      ref: inputRef,
      onBlur: validate,
      onInvalid: (event: FormEvent<ValidationTarget>) => {
        validate();
        event.preventDefault();
      },
    },
  };
}
