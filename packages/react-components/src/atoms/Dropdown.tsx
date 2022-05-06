import {
  ComponentProps,
  createContext,
  createRef,
  FC,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import Select, { OptionTypeBase, components, createFilter } from 'react-select';
import { css } from '@emotion/react';
import { v4 as uuidV4 } from 'uuid';

import { noop } from '../utils';
import { dropdownChevronIcon } from '../icons';
import { Option, reactSelectStyles } from '../select';
import { useValidation, validationMessageStyles } from '../form';

export const ENTER_KEYCODE = 13;

const containerStyles = css({
  flexBasis: '100%',
});
const DropdownIndicator: FC = () => dropdownChevronIcon;

const InputContext = createContext<
  ReturnType<typeof useValidation>['validationTargetProps'] &
    Pick<DropdownProps<string>, 'required'>
>({
  ref: createRef(),
  onBlur: noop,
  onInvalid: noop,
});

const Input: React.FC<ComponentProps<typeof components.Input>> = (props) => {
  const { ref, onBlur, ...inputProps } = useContext(InputContext);

  return (
    <components.Input
      {...props}
      {...inputProps}
      onBlur={(event) => {
        props.onBlur?.(event);
        onBlur(event);
      }}
      style={{ display: 'unset' }}
      autoComplete={uuidV4()}
      isHidden={false}
      innerRef={(element) => {
        ref.current = element;
        props.innerRef(element);
      }}
    />
  );
};

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
  const findOption = useCallback(
    (val) =>
      options.find((opt) => val.length > 0 && opt.value === val)?.label ?? '',
    [options],
  );

  const [inputValue, setInputValue] = useState<string>(findOption(value));
  useEffect(() => {
    setInputValue(findOption(value));
  }, [findOption, value]);

  const { validationMessage, validationTargetProps } =
    useValidation<HTMLInputElement>(
      customValidationMessage,
      getValidationMessage,
    );

  const handleInputValidation = (currentValue: string) => {
    const optionSelected = options.find(
      (option: OptionTypeBase) => option.label === currentValue,
    );

    setInputValue(optionSelected?.label ?? '');
    onChange(optionSelected?.value ?? ('' as V));
    setTimeout(validationTargetProps.onBlur, 0);
  };

  const filterOption = createFilter(null);

  return (
    <div css={containerStyles}>
      <InputContext.Provider value={{ ...validationTargetProps, required }}>
        <Select<OptionTypeBase>
          placeholder={placeholder}
          inputId={id}
          isDisabled={!enabled}
          inputValue={inputValue}
          options={options.filter((option) => option.value !== '')}
          filterOption={(opt, rawInput) => {
            if (rawInput === inputValue) {
              return true;
            }

            return filterOption(opt, rawInput);
          }}
          onBlur={(option: OptionTypeBase) => {
            handleInputValidation(option.target.value);
          }}
          controlShouldRenderValue={false}
          components={{ DropdownIndicator, Input }}
          styles={reactSelectStyles(!!validationMessage)}
          noOptionsMessage={noOptionsMessage}
          tabSelectsValue={false}
          onKeyDown={(option) => {
            if (option.keyCode === ENTER_KEYCODE)
              handleInputValidation(inputValue);
          }}
          onChange={(option) => {
            onChange(option?.value);
            setInputValue(option?.label);
            setTimeout(validationTargetProps.onBlur, 0);
          }}
          onInputChange={(newInputValue, { action }) => {
            switch (action) {
              case 'input-change':
                setInputValue(newInputValue);
                break;
            }
          }}
        />
      </InputContext.Provider>
      <div css={validationMessageStyles}>{validationMessage}</div>
    </div>
  );
}
