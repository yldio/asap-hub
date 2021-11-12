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
type MultiSelectProps = {
  readonly customValidationMessage?: string;

  readonly id?: string;
  readonly suggestions: ReadonlyArray<string>;
  readonly enabled?: boolean;

  readonly placeholder?: string;

  readonly values?: string[];
  readonly onChange?: (newValues: string[]) => void;
} & Pick<ComponentProps<typeof Select>, 'noOptionsMessage'>;
const MultiSelect: FC<MultiSelectProps> = ({
  customValidationMessage = '',

  id,
  suggestions,
  enabled = true,
  placeholder = '',
  noOptionsMessage,

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
        options={suggestions.map((suggestion) => ({
          value: suggestion,
          label: suggestion,
        }))}
        value={inputValues.map((value) => ({
          value,
          label: value,
        }))}
        onFocus={() => setValidationMsg('')}
        onBlur={() => setValidationMsg(customValidationMessage)}
        onChange={(options) => {
          const newValues = options.map(({ value }) => value);
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
