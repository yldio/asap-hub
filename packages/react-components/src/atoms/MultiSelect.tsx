import { css } from '@emotion/react';
import { FC, useState } from 'react';
import { OptionTypeBase } from 'react-select';
import Select from 'react-select';
import { validationMessageStyles } from '../form';
import { reactMultiSelectStyles } from '../select';
import { noop } from '../utils';
// import { crossIcon } from '../icons';

// const valueRemoveStyles = css({
//   paddingLeft: '9px',
//   display: 'flex',
//   cursor: 'pointer',

//   svg: { width: '12px', height: '12px', strokeWidth: '1.5' },
// });

const containerStyles = css({
  flexBasis: '100%',
});
interface MultiSelectProps {
  readonly customValidationMessage?: string;

  readonly id?: string;
  readonly suggestions: ReadonlyArray<string>;
  readonly enabled?: boolean;

  readonly placeholder?: string;

  readonly values: string[];
  readonly onChange?: (newValues: string[]) => void;
}
const MultiSelect: FC<MultiSelectProps> = ({
  customValidationMessage = '',

  id,
  suggestions,
  enabled = true,
  placeholder = '',

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
        // components={ }}
        styles={reactMultiSelectStyles(!!customValidationMessage)}
      />
      <div css={validationMessageStyles}>{customValidationMessage}</div>
    </div>
  );
};

export default MultiSelect;
