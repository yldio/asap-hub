import { css } from '@emotion/react';
import {
  ComponentProps,
  FC,
  ReactElement,
  useState,
  MouseEventHandler,
} from 'react';
import Select, {
  ActionMeta,
  components,
  MultiValueProps,
  OptionsType,
  Props,
} from 'react-select';
import AsyncSelect from 'react-select/async';
import {
  SortableContainer,
  SortableContainerProps,
  SortableElement,
  SortEndHandler,
  SortableHandle,
} from 'react-sortable-hoc';
import { MultiValueGenericProps } from 'react-select/src/components/MultiValue';

import { validationMessageStyles } from '../form';
import { reactMultiSelectStyles } from '../select';
import { noop } from '../utils';
import { crossIcon } from '../icons';

export function arrayMove<T>(array: readonly T[], from: number, to: number) {
  const slicedArray = array.slice();
  const removed = slicedArray.splice(from, 1)[0];
  slicedArray.splice(to < 0 ? array.length + to : to, 0, removed);
  return slicedArray;
}

const SortableMultiValue = SortableElement(
  (props: MultiValueProps<MultiSelectOptionsType>) => {
    // this prevents the menu from being opened/closed when the user clicks
    // on a value to begin dragging it. ideally, detecting a click (instead of
    // a drag) would still focus the control and toggle the menu, but that
    // requires some magic with refs that are out of scope for this example
    const onMouseDown: MouseEventHandler<HTMLDivElement> = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };
    const innerProps = { ...props.innerProps, onMouseDown };
    return <components.MultiValue {...props} innerProps={innerProps} />;
  },
);

const SortableMultiValueLabel = SortableHandle(
  (props: MultiValueGenericProps<MultiSelectOptionsType>) => (
    <components.MultiValueLabel {...props} />
  ),
);

const SortableAsyncSelect = SortableContainer(AsyncSelect, {
  withRef: true,
}) as React.ComponentClass<
  Props<MultiSelectOptionsType, true> & SortableContainerProps
>;

const SortableSelect = SortableContainer(Select, {
  withRef: true,
}) as React.ComponentClass<
  Props<MultiSelectOptionsType, true> & SortableContainerProps
>;

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
  | (Select<MultiSelectOptionsType, true> & { getWrappedInstance: undefined })
  | (AsyncSelect<MultiSelectOptionsType, true> & {
      getWrappedInstance: undefined;
    })
  | {
      blur: undefined;
      getWrappedInstance: () => Select<MultiSelectOptionsType, true>;
    }
  | {
      blur: undefined;
      getWrappedInstance: () => AsyncSelect<MultiSelectOptionsType, true>;
    }
  | null;

type MultiSelectProps = {
  readonly customValidationMessage?: string;
  readonly id?: string;
  readonly enabled?: boolean;
  readonly placeholder?: string;
  readonly onChange?: (newValues: OptionsType<MultiSelectOptionsType>) => void;
  readonly values?: OptionsType<MultiSelectOptionsType>;
  readonly sortable?: boolean;
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
  sortable = true,
}) => {
  const [validationMsg, setValidationMsg] = useState('');

  // This is to handle a bug with Select where the right click would make it impossible to write
  let inputRef: RefType = null;
  const handleOnContextMenu = () => {
    inputRef?.blur?.();
    inputRef?.getWrappedInstance?.().blur?.();
  };

  let sortableProps: SortableContainerProps | undefined;

  if (sortable) {
    const onSortEnd: SortEndHandler = ({ oldIndex, newIndex }) => {
      const newValue = arrayMove(values, oldIndex, newIndex);
      onChange(newValue);
    };

    sortableProps = {
      useDragHandle: true,
      axis: 'xy',
      onSortEnd,
      // small fix for https://github.com/clauderic/react-sortable-hoc/pull/352:
      getHelperDimensions: ({ node }) => node.getBoundingClientRect(),
    };
  }

  const commonProps: Props<MultiSelectOptionsType, true> &
    Partial<SortableContainerProps> = {
    ...sortableProps,
    inputId: id,
    isDisabled: !enabled,
    isMulti: true as const,
    placeholder,
    value: values,
    components: {
      MultiValueRemove,
      // @ts-expect-error // We're failing to provide a required index prop to SortableElement
      MultiValue: sortable ? SortableMultiValue : undefined,
      MultiValueLabel: sortable ? SortableMultiValueLabel : undefined,
    },
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

  const SelectComponent = sortable ? SortableSelect : Select;
  const AsyncSelectComponent = sortable ? SortableAsyncSelect : AsyncSelect;

  return (
    <div css={containerStyles} onContextMenu={handleOnContextMenu}>
      {suggestions ? (
        <SelectComponent
          {...commonProps}
          options={suggestions.map((suggestion) => ({
            value: suggestion,
            label: suggestion,
          }))}
        />
      ) : (
        <AsyncSelectComponent
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
