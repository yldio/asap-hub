import {
  ComponentProps,
  createContext,
  createRef,
  FC,
  useContext,
  useState,
} from 'react';
import Select, { OptionTypeBase, components } from 'react-select';
import { css } from '@emotion/react';
import { v4 as uuidV4 } from 'uuid';

import { noop } from '../utils';
import { dropdownChevronIcon } from '../icons';
import { Option, reactSelectStyles } from '../select';
import { useValidation, validationMessageStyles } from '../form';

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

  value,
  onChange = noop,
  noOptionsMessage,
}: DropdownProps<V>): ReturnType<FC> {
  const [inputValue, setInputValue] = useState<string>(value);
  const [lastValidValue, setLastInputValue] = useState<V>(value);

  const handleInputValue = (newValue: string) => {
    const isValidValue =
      options.filter((option: OptionTypeBase) => option.value === newValue)
        .length > 0;

    return isValidValue ? lastValidValue : '';
  };

  const { validationMessage, validationTargetProps } =
    useValidation<HTMLInputElement>(
      customValidationMessage,
      getValidationMessage,
    );

  return (
    <div css={containerStyles}>
      <InputContext.Provider value={{ ...validationTargetProps, required }}>
        <Select<OptionTypeBase>
          inputId={id}
          isDisabled={!enabled}
          inputValue={inputValue}
          value={{ value, label: value }}
          options={options.filter((option) => option.value !== '')}
          onBlur={(option: OptionTypeBase) => {
            setInputValue(handleInputValue(option.target.value));
            setTimeout(validationTargetProps.onBlur, 0);
          }}
          controlShouldRenderValue={false}
          components={{ DropdownIndicator, Input }}
          styles={reactSelectStyles(!!validationMessage)}
          noOptionsMessage={noOptionsMessage}
          tabSelectsValue={false}
          onChange={(option) => {
            onChange(option?.value);
            setLastInputValue(option?.value);
            setInputValue(option?.value);
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
