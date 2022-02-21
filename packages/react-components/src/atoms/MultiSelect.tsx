import { css } from '@emotion/react';
import { ComponentProps, FC, ReactElement, useState } from 'react';
import Select, { components, OptionTypeBase } from 'react-select';
import { validationMessageStyles } from '../form';
import { reactMultiSelectStyles } from '../select';
import { noop } from '../utils';
import { crossIcon } from '../icons';

export const MultiValueRemove = (
  props: ComponentProps<typeof components.MultiValueRemove>,
): ReactElement => (
  <components.MultiValueRemove {...props}>
    {crossIcon}
  </components.MultiValueRemove>
);

const containerStyles = css({
  flexBasis: '100%',
});

type MultiSelectProps = {
  readonly customValidationMessage?: string;
  readonly id?: string;
  readonly enabled?: boolean;
  readonly placeholder?: string;
  readonly isSimple?: boolean;
} & Pick<ComponentProps<typeof Select>, 'noOptionsMessage'>;

export type SimpleValuesMultiSelecletProps = MultiSelectProps & {
  readonly values?: string[];
  readonly onChange?: (newValues: string[]) => void;
  readonly suggestions?: ReadonlyArray<string>;
  readonly isSimple?: true;
};

const MultiSelect: FC<SimpleValuesMultiSelecletProps> = ({
  customValidationMessage = '',

  id,
  suggestions,
  enabled = true,
  placeholder = '',
  noOptionsMessage,
  isSimple = true,
  values = [],
  onChange = noop,
}) => {
  const [inputValues, setInputValues] = useState(values);
  const [validationMsg, setValidationMsg] = useState('');

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
        options={suggestions?.map((suggestion: string) => ({
          value: suggestion,
          label: suggestion,
        }))}
        value={inputValues.map((value: string) =>
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
