import {
  ComponentProps,
  createContext,
  createRef,
  FC,
  useContext,
  useState,
} from 'react';
import Select, {
  OptionTypeBase,
  InputActionMeta,
  components,
} from 'react-select';
import { css } from '@emotion/react';

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
    Pick<DropdownProps, 'required'>
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
      autoComplete="off"
      isHidden={false}
      innerRef={(element) => {
        ref.current = element;
        props.innerRef(element);
      }}
    />
  );
};

type DropdownProps = {
  readonly customValidationMessage?: string;
  readonly getValidationMessage?: Parameters<typeof useValidation>[1];

  readonly id?: string;
  readonly options: ReadonlyArray<Option<string>>;
  readonly enabled?: boolean;
  readonly required?: boolean;

  readonly value: string;
  readonly onChange?: (newValue: string) => void;
  readonly noOptionsMessage?: (value: { inputValue: string }) => string | null;
};

const Dropdown: FC<DropdownProps> = ({
  customValidationMessage = '',
  getValidationMessage,
  noOptionsMessage = () => null,

  id,
  options,
  enabled = true,
  required = false,

  value,
  onChange = noop,
}) => {
  const [inputValue, setInputValue] = useState(value);

  const { validationMessage, validationTargetProps } =
    useValidation<HTMLInputElement>(
      customValidationMessage,
      getValidationMessage,
    );

  const onNewValue = (newValue: string) => {
    setInputValue(newValue);
    onChange(newValue);
    // Hack to re-validate once the selected value has been put in the state of the input field
    setTimeout(validationTargetProps.onBlur, 0);
  };
  return (
    <div css={containerStyles}>
      <InputContext.Provider value={{ ...validationTargetProps, required }}>
        <Select<OptionTypeBase>
          inputId={id}
          isDisabled={!enabled}
          inputValue={inputValue}
          value={{ value, label: value }}
          options={options.filter((option) => option.value !== '')}
          components={{ DropdownIndicator, Input }}
          styles={reactSelectStyles(!!validationMessage)}
          noOptionsMessage={noOptionsMessage}
          tabSelectsValue={false}
          controlShouldRenderValue={false}
          onChange={(option: OptionTypeBase | null) => {
            onNewValue(option?.value || '');
          }}
          onInputChange={(
            newInputValue: string,
            { action }: InputActionMeta,
          ) => {
            switch (action) {
              case 'input-change':
                onNewValue(newInputValue);
                break;
            }
          }}
        />
      </InputContext.Provider>
      <div css={validationMessageStyles}>{validationMessage}</div>
    </div>
  );
};

export default Dropdown;
