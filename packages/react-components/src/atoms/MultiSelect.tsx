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

import { validationMessageStyles } from '../form';
import { reactMultiSelectStyles } from '../select';
import { noop } from '../utils';
import { crossIcon } from '../icons';
import {
  SortableContainer,
  SortableContainerProps,
  SortableElement,
  SortEndHandler,
  SortableHandle,
} from 'react-sortable-hoc';
import { MultiValueGenericProps } from 'react-select/src/components/MultiValue';

function arrayMove<T>(array: readonly T[], from: number, to: number) {
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

const SortableAsyncSelect = SortableContainer(
  AsyncSelect,
) as React.ComponentClass<
  Props<MultiSelectOptionsType, true> & SortableContainerProps
>;

const SortableSelect = SortableContainer(Select) as React.ComponentClass<
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

  const onSortEnd: SortEndHandler = ({ oldIndex, newIndex }) => {
    const newValue = arrayMove(values, oldIndex, newIndex);
    onChange(newValue);
    console.log(
      'Values sorted:',
      newValue.map((i) => i.value),
    );
  };

  const commonProps: Props<MultiSelectOptionsType, true> &
    SortableContainerProps = {
    useDragHandle: true,
    axis: 'xy',
    onSortEnd,
    // small fix for https://github.com/clauderic/react-sortable-hoc/pull/352:
    getHelperDimensions: ({ node }) => node.getBoundingClientRect(),
    inputId: id,
    isDisabled: !enabled,
    isMulti: true as const,
    placeholder,
    value: values,
    components: {
      MultiValueRemove,
      // @ts-expect-error // We're failing to provide a required index prop to SortableElement
      MultiValue: SortableMultiValue,
      MultiValueLabel: SortableMultiValueLabel,
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

  return (
    <div css={containerStyles} onContextMenu={handleOnContextMenu}>
      {suggestions ? (
        <SortableSelect
          {...commonProps}
          options={suggestions.map((suggestion) => ({
            value: suggestion,
            label: suggestion,
          }))}
        />
      ) : (
        <SortableAsyncSelect
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
