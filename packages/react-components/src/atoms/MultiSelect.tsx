import { css } from '@emotion/react';
import { ComponentProps, FC, useState } from 'react';
import Select, { components, OptionTypeBase } from 'react-select';
import { validationMessageStyles } from '../form';
import { reactMultiSelectStyles } from '../select';
import { noop } from '../utils';
import { crossIcon } from '../icons';

const MultiValueRemove = (
  props: ComponentProps<typeof components.MultiValueRemove>,
) => (
  <components.MultiValueRemove {...props}>
    {crossIcon}
  </components.MultiValueRemove>
);

const containerStyles = css({
  flexBasis: '100%',
});

export type ComplexValue = { value: string; label: string };

type MultiSelectProps = {
  readonly customValidationMessage?: string;
  readonly id?: string;
  readonly enabled?: boolean;
  readonly placeholder?: string;
} & Pick<ComponentProps<typeof Select>, 'noOptionsMessage'>;

type SimpleValuesMultiSelecletProps = MultiSelectProps & {
  readonly values?: string[];
  readonly onChange?: (newValues: string[]) => void;
  readonly suggestions?: ReadonlyArray<string>;
  readonly isSimple: true;
};
type ComplexValuesMultiSelecletProps = MultiSelectProps & {
  readonly values?: ComplexValue[];
  readonly onChange?: (newValues: ComplexValue[]) => void;
  readonly suggestions?: ReadonlyArray<ComplexValue>;
  readonly isSimple: false;
};

const MultiSelect: FC<
  SimpleValuesMultiSelecletProps | ComplexValuesMultiSelecletProps
> = ({
  customValidationMessage = '',

  id,
  suggestions,
  enabled = true,
  placeholder = '',
  noOptionsMessage,
  isSimple,
  values = [],
  onChange = noop,
}) => {
  const [inputValues, setInputValues] = useState(values);
  const [validationMsg, setValidationMsg] = useState('');

  const options: ComplexValue[] | undefined = suggestions?.map(
    (suggestion: string | ComplexValue) =>
      isSimple
        ? ({
            value: suggestion,
            label: suggestion,
          } as ComplexValue)
        : (suggestion as ComplexValue),
  );

  // This is to handle a bug with Select where the right click would make it impossoble to write
  let inputRef: Select<OptionTypeBase, true> | null;
  const handleOnContextMenu = () => {
    inputRef?.blur();
  };

  return (
    <div css={containerStyles} onContextMenu={handleOnContextMenu}>
      <Select<OptionTypeBase, true>
        inputId={id}
        isDisabled={!enabled}
        ref={(ref) => {
          inputRef = ref;
        }}
        isMulti
        options={options}
        value={inputValues.map((value: string | ComplexValue) =>
          isSimple
            ? {
                value,
                label: value,
              }
            : value,
        )}
        onFocus={() => setValidationMsg('')}
        onBlur={() => setValidationMsg(customValidationMessage)}
        onChange={(options) => {
          const newValues = options.map(({ value, label }) =>
            isSimple ? value : { value, label },
          );
          setInputValues(newValues);
          onChange(newValues);
        }}
        placeholder={placeholder}
        components={{ MultiValueRemove }}
        noOptionsMessage={noOptionsMessage}
        styles={reactMultiSelectStyles(!!validationMsg)}
      />
      <div css={validationMessageStyles}>{validationMsg}</div>
    </div>
  );
};

export default MultiSelect;
