import { css } from '@emotion/react';
import { ComponentProps, FC, ReactElement, useState } from 'react';
import Select, { ActionMeta, components, OptionsType } from 'react-select';
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

export type MultiSelectOptionsType = {
  isFixed?: boolean;
  label: string;
  value: string;
};

type RefType =
  | Select<MultiSelectOptionsType, true>
  | AsyncSelect<MultiSelectOptionsType, true>
  | null;

type MultiSelectProps = {
  readonly customValidationMessage?: string;
  readonly id?: string;
  readonly enabled?: boolean;
  readonly placeholder?: string;
  readonly onChange?: (newValues: OptionsType<MultiSelectOptionsType>) => void;
  readonly values?: OptionsType<MultiSelectOptionsType>;
} & (
  | (Pick<ComponentProps<typeof Select>, 'noOptionsMessage'> & {
      readonly suggestions: ReadonlyArray<string>;
      readonly loadOptions?: undefined;
    })
  | (Pick<ComponentProps<typeof AsyncSelect>, 'noOptionsMessage'> & {
      readonly loadOptions: (
        inputValue: string,
        callback: (options: ReadonlyArray<MultiSelectOptionsType>) => void,
      ) => Promise<ReadonlyArray<MultiSelectOptionsType>> | void;
      readonly suggestions?: undefined;
    })
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
    value: values,
    components: { MultiValueRemove },
    noOptionsMessage,
    styles: reactMultiSelectStyles(!!validationMsg),

    ref: (ref: RefType) => {
      inputRef = ref;
    },
    onFocus: () => setValidationMsg(''),
    onBlur: () => setValidationMsg(customValidationMessage),
    onChange: (
      options: OptionsType<MultiSelectOptionsType>,
      actionMeta: ActionMeta<MultiSelectOptionsType>,
    ) => {
      switch (actionMeta.action) {
        case 'remove-value':
        case 'pop-value':
          if (actionMeta.removedValue.isFixed) {
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
        <Select<MultiSelectOptionsType, true>
          {...commonProps}
          options={suggestions.map((suggestion) => ({
            value: suggestion,
            label: suggestion,
          }))}
        />
      ) : (
        <AsyncSelect<MultiSelectOptionsType, true>
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
