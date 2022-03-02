import { css } from '@emotion/react';
import { ComponentProps, FC, ReactElement, useState } from 'react';
import Select, { components, OptionsType, OptionTypeBase } from 'react-select';
import AsyncSelect from 'react-select/async';

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

type RefType =
  | Select<OptionTypeBase, true>
  | AsyncSelect<OptionTypeBase, true>
  | null;

type MultiSelectProps = {
  readonly customValidationMessage?: string;
  readonly id?: string;
  readonly enabled?: boolean;
  readonly placeholder?: string;
  readonly onChange?: (newValues: OptionsType<OptionTypeBase>) => void;
  readonly values?: OptionsType<OptionTypeBase>;
} & (
  | (Pick<ComponentProps<typeof Select>, 'noOptionsMessage'> & {
      readonly suggestions: ReadonlyArray<string>;
      readonly loadOptions?: undefined;
    })
  | (Pick<
      ComponentProps<typeof AsyncSelect>,
      'loadOptions' | 'noOptionsMessage'
    > & { suggestions?: undefined })
);

const MultiSelect: FC<MultiSelectProps> = ({
  customValidationMessage = '',
  loadOptions,
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

  // This is to handle a bug with Select where the right click would make it impossible to write
  let inputRef: RefType = null;
  const handleOnContextMenu = () => {
    inputRef?.blur();
  };

  const commonProps = {
    inputId: id,
    isDisabled: !enabled,
    isMulti: true as const,
    placeholder,
    value: inputValues,
    components: { MultiValueRemove },
    noOptionsMessage,
    styles: reactMultiSelectStyles(!!validationMsg),

    ref: (ref: RefType) => {
      inputRef = ref;
    },
    onFocus: () => setValidationMsg(''),
    onBlur: () => setValidationMsg(customValidationMessage),
    onChange: (options: OptionsType<OptionTypeBase>) => {
      setInputValues(options);
      onChange(options);
    },
  };

  return (
    <div css={containerStyles} onContextMenu={handleOnContextMenu}>
      {suggestions ? (
        <Select<OptionTypeBase, true>
          {...commonProps}
          options={suggestions.map((suggestion) => ({
            value: suggestion,
            label: suggestion,
          }))}
        />
      ) : (
        <AsyncSelect<OptionTypeBase, true>
          {...commonProps}
          loadOptions={loadOptions}
          cacheOptions
          defaultOptions
        />
      )}
      <div css={validationMessageStyles}>{validationMsg}</div>
    </div>
  );
};

export default MultiSelect;
