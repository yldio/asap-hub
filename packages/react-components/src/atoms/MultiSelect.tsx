import { css } from '@emotion/react';
import { ComponentProps, FC, useState } from 'react';
import { components, OptionTypeBase } from 'react-select';
import Select from 'react-select';
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

  readonly values: string[];
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

  return (
    <div css={containerStyles}>
      <Select<OptionTypeBase, true>
        inputId={id}
        isDisabled={!enabled}
        isMulti
        options={suggestions.map((suggestion) => ({
          value: suggestion,
          label: suggestion,
        }))}
        value={inputValues.map((value) => ({
          value,
          label: value,
        }))}
        onChange={(options) => {
          const newValues = options.map(({ value }) => value);
          setInputValues(newValues);
          onChange(newValues);
        }}
        placeholder={placeholder}
        components={{ MultiValueRemove }}
        noOptionsMessage={noOptionsMessage}
        styles={reactMultiSelectStyles(!!customValidationMessage)}
      />
      <div css={validationMessageStyles}>{customValidationMessage}</div>
    </div>
  );
};

export default MultiSelect;
