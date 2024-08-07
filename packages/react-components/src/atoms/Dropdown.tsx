import { css, useTheme } from '@emotion/react';
import { FC, useCallback, useEffect, useMemo, useRef } from 'react';
import Select, { ControlProps, OptionTypeBase } from 'react-select';
import { v4 as uuidV4 } from 'uuid';
import { useValidation, validationMessageStyles } from '../form';
import { dropdownChevronIcon, dropdownCrossIcon } from '../icons';
import { Option, reactSelectStyles } from '../select';
import { noop } from '../utils';

export const ENTER_KEYCODE = 13;
const containerStyles = css({
  flexBasis: '100%',
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
  readonly name?: string;

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
  name,

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
  const checkValidation = useCallback(() => {
    if (initialRender.current) {
      initialRender.current = false;
    } else {
      validate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (required === false) {
      checkValidation();
    }
  }, [required, checkValidation]);

  useEffect(() => {
    checkValidation();
  }, [value, checkValidation]);

  const validOptions = useMemo(
    () => options.filter((option) => option.value !== ''),
    [options],
  );
  const selectValue = validOptions.find((option) => option.value === value);
  const theme = useTheme();
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
        value={selectValue || null}
        components={{ DropdownIndicator, ClearIndicator }}
        styles={reactSelectStyles(theme, !!validationMessage)}
        noOptionsMessage={noOptionsMessage}
        tabSelectsValue={false}
        autoComplete={uuidV4()}
        onBlur={checkValidation}
        aria-label={name}
      />
      <input
        {...validationTargetProps}
        tabIndex={-1}
        autoComplete="off"
        value={value}
        required={required}
        disabled={!enabled}
        hidden={true}
        onChange={noop}
      />

      <div css={validationMessageStyles}>{validationMessage}</div>
    </div>
  );
}
