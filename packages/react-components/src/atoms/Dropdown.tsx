import { css } from '@emotion/react';
import { FC, useCallback, useEffect } from 'react';
import Select, { OptionTypeBase } from 'react-select';
import { v4 as uuidV4 } from 'uuid';
import { useValidation, validationMessageStyles } from '../form';
import { dropdownChevronIcon } from '../icons';
import { Option, reactSelectStyles } from '../select';
import { noop } from '../utils';

export const ENTER_KEYCODE = 13;

const containerStyles = css({
  flexBasis: '100%',
  position: 'relative',
});
const DropdownIndicator: FC = () => dropdownChevronIcon;
const hiddenInput = css({
  opacity: 0,
  width: '100%',
  height: 0,
  position: 'absolute',
});
export interface DropdownProps<V extends string> {
  readonly customValidationMessage?: string;
  readonly getValidationMessage?: Parameters<typeof useValidation>[1];

  readonly id?: string;
  readonly options: ReadonlyArray<Option<V>>;
  readonly enabled?: boolean;
  readonly required?: boolean;
  readonly placeholder?: string;

  readonly value: V;
  readonly onChange?: (newValue: V) => void;
  readonly noOptionsMessage?: (value: { inputValue: string }) => string | null;
}
export default function Dropdown<V extends string>({
  customValidationMessage = '',
  getValidationMessage,
  id,
  options,
  enabled = true,
  required = false,
  placeholder = 'Start Typing...',

  value,
  onChange = noop,
  noOptionsMessage,
}: DropdownProps<V>): ReturnType<FC> {
  const { validationMessage, validationTargetProps, validate } =
    useValidation<HTMLInputElement>(
      customValidationMessage,
      getValidationMessage,
    );

  const useValidate = useCallback(() => {
    if (value !== '') {
      validate();
    }
  }, [value]);
  useEffect(useValidate, [useValidate]);

  return (
    <div css={containerStyles}>
      <Select<OptionTypeBase>
        placeholder={placeholder}
        inputId={id}
        isDisabled={!enabled}
        options={options.filter((option) => option.value !== '')}
        value={options.find((option) => option.value === value)}
        components={{ DropdownIndicator }}
        styles={reactSelectStyles(!!validationMessage)}
        noOptionsMessage={noOptionsMessage}
        tabSelectsValue={false}
        autoComplete={uuidV4()}
        onChange={(option) => {
          onChange(option?.value);
        }}
        onBlur={validate}
      />
      <input
        {...validationTargetProps}
        tabIndex={-1}
        autoComplete="off"
        css={[hiddenInput]}
        value={value}
        required={required}
      />

      <div css={validationMessageStyles}>{validationMessage}</div>
    </div>
  );
}
