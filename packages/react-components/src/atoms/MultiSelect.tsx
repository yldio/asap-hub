import { css } from '@emotion/react';
import { ComponentProps, ReactElement, useState } from 'react';
import Select, {
  ActionMeta,
  components,
  OptionsType,
  Props,
} from 'react-select';
import AsyncSelect, { Props as AsyncProps } from 'react-select/async';

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

export type MultiSelectOptionType = {
  isFixed?: boolean;
  label: string;
  value: string;
};

type RefType<T extends MultiSelectOptionType> =
  | Select<T, true>
  | AsyncSelect<T, true>
  | null;

export type MultiSelectProps<T extends MultiSelectOptionType> = {
  readonly customValidationMessage?: string;
  readonly id?: string;
  readonly enabled?: boolean;
  readonly placeholder?: string;
  readonly onChange?: (newValues: OptionsType<T>) => void;
  readonly values?: OptionsType<T>;
} & (
  | (Pick<Props<T, true>, 'noOptionsMessage' | 'components'> & {
      suggestions: ReadonlyArray<string>;
      readonly loadOptions?: undefined;
    })
  | (Pick<AsyncProps<T, true>, 'noOptionsMessage' | 'components'> & {
      readonly loadOptions: (
        inputValue: string,
        callback: (options: ReadonlyArray<T>) => void,
      ) => Promise<ReadonlyArray<T>> | void;
      suggestions?: undefined;
    })
);

const MultiSelect = <T extends MultiSelectOptionType>({
  customValidationMessage = '',
  loadOptions,
  id,
  suggestions,
  enabled = true,
  components,
  placeholder = '',
  noOptionsMessage,
  values = [],
  onChange = noop,
}: MultiSelectProps<T>): ReactElement => {
  const [validationMsg, setValidationMsg] = useState('');

  // This is to handle a bug with Select where the right click would make it impossible to write
  let inputRef: RefType<T> = null;
  const handleOnContextMenu = () => {
    inputRef?.blur();
  };

  const commonProps = {
    inputId: id,
    isDisabled: !enabled,
    isMulti: true as const,
    placeholder,
    value: values,
    components: { MultiValueRemove, ...components },
    noOptionsMessage,
    styles: reactMultiSelectStyles<T>(!!validationMsg),

    ref: (ref: RefType<T>) => {
      inputRef = ref;
    },
    onFocus: () => setValidationMsg(''),
    onBlur: () => setValidationMsg(customValidationMessage),
    onChange: (options: OptionsType<T>, actionMeta: ActionMeta<T>) => {
      switch (actionMeta.action) {
        case 'remove-value':
        case 'pop-value':
          if (actionMeta.removedValue && actionMeta.removedValue.isFixed) {
            return;
          }
          break;
      }
      onChange(options);
    },
  };

  return (
    <div css={containerStyles} onContextMenu={handleOnContextMenu}>
      {suggestions ? (
        <Select<T, true>
          {...commonProps}
          options={suggestions.map((suggestion) => ({
            value: suggestion,
            label: suggestion,
            options: [],
          }))}
        />
      ) : (
        <AsyncSelect<T, true>
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
