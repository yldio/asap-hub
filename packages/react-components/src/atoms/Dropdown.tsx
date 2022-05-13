import { css } from '@emotion/react';
import { FC, useCallback, useEffect, useRef } from 'react';
import Select, { ControlProps, OptionTypeBase } from 'react-select';
import { v4 as uuidV4 } from 'uuid';
import { useValidation, validationMessageStyles } from '../form';
import { dropdownChevronIcon, dropdownCrossIcon } from '../icons';
import { Option, reactSelectStyles } from '../select';
import { noop } from '../utils';

const containerStyles = css({
  flexBasis: '100%',
  position: 'relative',
});
const DropdownIndicator: FC = () => dropdownChevronIcon;
const CrossIcon: FC = () => dropdownCrossIcon;
const ClearIndicator = ({
  innerProps,
}: Pick<ControlProps<OptionTypeBase, false>, 'innerProps'>) => (
  <span {...innerProps}>
    <CrossIcon />
  </span>
);
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

  const initialRender = useRef(true);
  const useValidate = useCallback(() => {
    if (initialRender.current) {
      initialRender.current = false;
    } else {
      validate();
    }
  }, [validate]);
  useEffect(useValidate, [useValidate]);

  const validOptions = options.filter((option) => option.value !== '');
  return (
    <div css={containerStyles}>
      <Select<OptionTypeBase>
        placeholder={placeholder}
        inputId={id}
        isClearable={!required}
        isDisabled={!enabled}
        options={validOptions}
        onChange={(option) => {
          onChange(option?.value);
        }}
        value={validOptions.find((option) => option.value === value)}
        components={{ DropdownIndicator, ClearIndicator }}
        styles={reactSelectStyles(!!validationMessage)}
        noOptionsMessage={noOptionsMessage}
        tabSelectsValue={false}
        autoComplete={uuidV4()}
        onBlur={validate}
      />
      <input
        {...validationTargetProps}
        tabIndex={-1}
        autoComplete="off"
        value={value}
        onChange={noop}
        required={required}
        disabled={!enabled}
        hidden={true}
      />

      <div css={validationMessageStyles}>{validationMessage}</div>
    </div>
  );
}
