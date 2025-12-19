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
import { lineHeight, rem } from './pixels';
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
  paddingLeft: rem(paddingLeftRight),
  paddingRight: rem(paddingLeftRight),
  paddingTop: rem(textPaddingTop),
  paddingBottom: rem(textPaddingBottom),

  lineHeight: rem(lineHeight),

  outline: 'none',

  borderStyle: 'solid',
  borderWidth: rem(borderWidth),
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
  paddingTop: rem(16),
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
  skipValidation: boolean = false,
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
    const input = inputRef.current;
    if (!input || skipValidation) return;

    // Normalize undefined to empty string to ensure setCustomValidity works correctly
    // (setCustomValidity(undefined) would convert to "undefined" string, keeping field invalid)
    const normalizedMessage = customValidationMessage || '';
    // Set the custom validity on the input element so browser knows about it
    input.setCustomValidity(normalizedMessage);
    // Update the validation message state when customValidationMessage changes
    // This handles both setting errors and clearing them when the field becomes valid
    setValidationMessage(normalizedMessage);

    return () => {
      if (!skipValidation) {
        input.setCustomValidity('');
      }
    };
  }, [customValidationMessage, skipValidation]);

  const validate = () => {
    if (inputRef.current && !skipValidation) {
      const inputField = inputRef.current;
      const inputFieldValidity = inputField.validity.valid;
      // Only NOW set the validation message state, which triggers display
      setValidationMessage(
        (getValidationMessage &&
          !inputFieldValidity &&
          getValidationMessage(inputField.validity)) ||
          inputField.validationMessage,
      );
    }
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
