import { css } from '@emotion/react';
import { ComponentProps, FC, useState } from 'react';
import { OptionTypeBase } from 'react-select';
import AsyncSelect from 'react-select/async';
import { reactMultiSelectStyles } from '../select';
import { noop } from '../utils';
import { MultiValueRemove } from './MultiSelect';

type MultiSelectProps = Pick<
  ComponentProps<typeof AsyncSelect>,
  'loadOptions' | 'noOptionsMessage'
> & {
  readonly customValidationMessage?: string;
  readonly id?: string;
  readonly enabled?: boolean;
  readonly placeholder?: string;
};

export type OptionValue = { value: string; label: string };

export type AsyncMultiSelectProps = MultiSelectProps & {
  readonly values?: OptionValue[];
  readonly onChange?: (newValues: OptionValue[]) => void;
};

const containerStyles = css({
  flexBasis: '100%',
});
const AsyncMultiSelect: FC<AsyncMultiSelectProps> = ({
  customValidationMessage = '',
  loadOptions,
  id,
  enabled = true,
  placeholder = '',
  noOptionsMessage,
  values = [],
  onChange = noop,
}) => {
  const [inputValues, setInputValues] = useState<OptionValue[]>(values);
  const [validationMsg, setValidationMsg] = useState('');
  let inputRef: AsyncSelect<OptionTypeBase, true> | null;
  const handleOnContextMenu = () => {
    inputRef?.blur();
  };
  return (
    <div css={containerStyles} onContextMenu={handleOnContextMenu}>
      <AsyncSelect<OptionTypeBase, true>
        inputId={id}
        isDisabled={!enabled}
        ref={(ref) => {
          inputRef = ref;
        }}
        isMulti
        cacheOptions
        loadOptions={loadOptions}
        onChange={(options) => {
          const newValues = options.map(({ value, label }) => ({
            value,
            label,
          }));
          setInputValues(newValues);
          onChange(newValues);
        }}
        onFocus={() => setValidationMsg('')}
        onBlur={() => setValidationMsg(customValidationMessage)}
        value={inputValues}
        components={{ MultiValueRemove }}
        noOptionsMessage={noOptionsMessage}
        placeholder={placeholder}
        styles={reactMultiSelectStyles(!!validationMsg)}
        defaultOptions
      />
    </div>
  );
};

export default AsyncMultiSelect;
