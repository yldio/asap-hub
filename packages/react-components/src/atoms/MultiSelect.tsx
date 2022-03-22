import { css } from '@emotion/react';
import { ComponentProps, FC, ReactElement, useState } from 'react';
import Select, { ActionMeta, components, OptionsType } from 'react-select';
import AsyncSelect from 'react-select/async';

import { validationMessageStyles } from '../form';
import { reactMultiSelectStyles } from '../select';
import { noop } from '../utils';
import { crossIcon } from '../icons';
import { perRem } from '../pixels';
import Avatar from './Avatar';

export const MultiValueRemove = (
  props: ComponentProps<typeof components.MultiValueRemove>,
): ReactElement => (
  <components.MultiValueRemove {...props}>
    {crossIcon}
  </components.MultiValueRemove>
);

const optionStyles = css({
  display: 'grid',

  gridTemplateColumns: `${24 / perRem}em 1fr`,
  gridColumnGap: `${8 / perRem}em`,

  background: 'red'
});

export const Option = (
  props: ComponentProps<typeof components.Option>
) => (
  <components.Option {...props}>
    <div css={optionStyles}>
      <Avatar
        firstName={props.label}
        lastName={props.label.split(' ')[1]}
        imageUrl={props.data.icon}
      />
      {props.children}
    </div>
  </components.Option>
);

export const MultiValueLabel = (
  props: ComponentProps<typeof components.MultiValueLabel>,
): ReactElement => (
  <components.MultiValueLabel {...props}>
    <div css={optionStyles}>
      <Avatar
        firstName={props.data.label.toString()}
        lastName={props.data.label.toString().split(' ')[1]}
        imageUrl={props.data.icon}
      />
      {props.children}
    </div>
  </components.MultiValueLabel>
);

const containerStyles = css({
  flexBasis: '100%',
});

export type MultiSelectOptionsType = {
  isFixed?: boolean;
  label: string;
  value: string;
  icon?: string;
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
  icons?: boolean;
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
  icons = false,
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
    components: { MultiValueRemove, ...(icons ? { Option, MultiValueLabel } : {}) },
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
