import { css } from '@emotion/react';
import {
  ComponentProps,
  createContext,
  createRef,
  FC,
  useContext,
  useState,
} from 'react';
import { components, OptionTypeBase } from 'react-select';
import Creatable from 'react-select/creatable';
import { dropdownChevronIcon } from '../icons';
import { useValidation, validationMessageStyles } from '../form';
import { reactSelectStyles } from '../select';
import { noop } from '../utils';

const containerStyles = css({
  flexBasis: '100%',
});

const DropdownIndicator: FC = () => dropdownChevronIcon;

const InputContext = createContext<
  ReturnType<typeof useValidation>['validationTargetProps'] &
    Pick<TypeaheadProps, 'required' | 'maxLength'>
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

interface TypeaheadProps {
  readonly customValidationMessage?: string;
  readonly getValidationMessage?: Parameters<typeof useValidation>[1];

  readonly id?: string;
  readonly suggestions: ReadonlyArray<string>;
  readonly enabled?: boolean;

  readonly required?: boolean;
  readonly maxLength?: number;

  readonly value: string;
  readonly onChange?: (newValue: string) => void;
}
const Typeahead: FC<TypeaheadProps> = ({
  customValidationMessage = '',
  getValidationMessage,

  id,
  suggestions,
  enabled = true,
  required = false,
  maxLength,

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
      <InputContext.Provider
        value={{ ...validationTargetProps, required, maxLength }}
      >
        <Creatable<OptionTypeBase>
          inputId={id}
          isDisabled={!enabled}
          options={suggestions.map((suggestion) => ({
            value: suggestion,
            label: suggestion,
          }))}
          value={{ value, label: value }}
          onChange={(option) => onNewValue(option?.value || '')}
          inputValue={inputValue}
          onInputChange={(newInputValue, { action }) => {
            switch (action) {
              case 'input-change':
                onNewValue(newInputValue);
                break;
            }
          }}
          placeholder="Start Typing…"
          noOptionsMessage={() => null}
          tabSelectsValue={false}
          controlShouldRenderValue={false}
          components={{ DropdownIndicator, Input }}
          styles={reactSelectStyles(!!validationMessage)}
        />
      </InputContext.Provider>
      <div css={validationMessageStyles}>{validationMessage}</div>
    </div>
  );
};

export default Typeahead;
