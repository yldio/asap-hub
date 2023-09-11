import { css, useTheme } from '@emotion/react';
import {
  ComponentProps,
  ReactElement,
  MouseEventHandler,
  useCallback,
  useEffect,
  useRef,
  ReactNode,
} from 'react';
import Select, {
  ActionMeta,
  components as reactAsyncComponents,
  MultiValueProps,
  OptionsType,
  Props,
} from 'react-select';
import AsyncSelect, { Props as AsyncProps } from 'react-select/async';
import AsyncCreatableSelect from 'react-select/async-creatable';
import {
  SortableContainer,
  SortableContainerProps,
  SortableElement,
  SortEndHandler,
  SortableHandle,
} from 'react-sortable-hoc';
import { MultiValueGenericProps } from 'react-select/src/components/MultiValue';

import { useValidation, validationMessageStyles } from '../form';
import { reactMultiSelectStyles } from '../select';
import { noop } from '../utils';
import { crossIcon } from '../icons';
import { pixels } from '..';

const { rem } = pixels;

export function arrayMove<T>(
  array: readonly T[],
  from: number,
  to: number,
): T[] {
  const slicedArray = array.slice();
  const removed = slicedArray.splice(from, 1)[0];
  if (!removed) {
    throw new Error('element couldnt be found');
  }
  slicedArray.splice(to < 0 ? array.length + to : to, 0, removed);

  return slicedArray;
}

export type MultiSelectOptionsType = {
  isFixed?: boolean;
  label: string;
  value: string;
};

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
    return (
      <reactAsyncComponents.MultiValue {...props} innerProps={innerProps} />
    );
  },
);

const SortableMultiValueLabel = SortableHandle(
  (props: MultiValueGenericProps<MultiSelectOptionsType>) => (
    <reactAsyncComponents.MultiValueLabel {...props} />
  ),
);

const SortableAsyncCreatableSelect = SortableContainer(AsyncCreatableSelect, {
  withRef: true,
}) as React.ComponentClass<
  Props<MultiSelectOptionsType, true> & SortableContainerProps
>;

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
  props: ComponentProps<typeof reactAsyncComponents.MultiValueRemove>,
): ReactElement => (
  <reactAsyncComponents.MultiValueRemove {...props}>
    {crossIcon}
  </reactAsyncComponents.MultiValueRemove>
);

const containerStyles = css({
  flexBasis: '100%',
  marginTop: rem(15),
});

type RefType<T extends MultiSelectOptionsType> =
  | (Select<T, true> & { getWrappedInstance: undefined })
  | (AsyncSelect<T, true> & {
      getWrappedInstance: undefined;
    })
  | {
      blur: undefined;
      getWrappedInstance: () => Select<T, true>;
    }
  | {
      blur: undefined;
      getWrappedInstance: () => AsyncSelect<T, true>;
    }
  | null;

export type MultiSelectProps<T extends MultiSelectOptionsType> = {
  readonly customValidationMessage?: string;
  readonly id?: string;
  readonly enabled?: boolean;
  readonly placeholder?: string;
  readonly onChange?: (newValues: OptionsType<T>) => void;
  readonly values?: OptionsType<T>;
  readonly sortable?: boolean;
  readonly creatable?: boolean;
  readonly required?: boolean;
  readonly getValidationMessage?: Parameters<typeof useValidation>[1];
  readonly maxMenuHeight?: number;
  readonly leftIndicator?: ReactNode;
} & (
  | (Pick<Props<T, true>, 'noOptionsMessage' | 'components'> & {
      readonly suggestions: ReadonlyArray<T>;
      readonly loadOptions?: undefined;
    })
  | (Pick<AsyncProps<T, true>, 'noOptionsMessage' | 'components'> & {
      readonly loadOptions: (
        inputValue: string,
        callback: (options: ReadonlyArray<T>) => void,
      ) => Promise<ReadonlyArray<T>> | void;
      readonly suggestions?: undefined;
    })
);

const MultiSelect = <T extends MultiSelectOptionsType>({
  customValidationMessage = '',
  loadOptions,
  id,
  suggestions,
  components,
  enabled = true,
  placeholder = '',
  maxMenuHeight,
  noOptionsMessage,
  values = [],
  onChange = noop,
  sortable = true,
  creatable = false,
  required = false,
  getValidationMessage,
  leftIndicator,
}: MultiSelectProps<T>): ReactElement => {
  const theme = useTheme();
  // This is to handle a bug with Select where the right click would make it impossible to write
  let inputRef: RefType<T> = null;
  const handleOnContextMenu = () => {
    inputRef?.blur?.();
    inputRef?.getWrappedInstance?.().blur?.();
  };

  const { validationMessage, validationTargetProps, validate } =
    useValidation<HTMLInputElement>(
      customValidationMessage,
      getValidationMessage,
    );

  const initialRender = useRef(true);
  const checkValidation = useCallback(() => {
    if (initialRender.current) {
      initialRender.current = false;
    } else {
      validate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    checkValidation();
  }, [values, checkValidation]);

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

  const commonProps: Props<T, true> & Partial<SortableContainerProps> = {
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
      ...(leftIndicator
        ? {
            Control: (props) => (
              <reactAsyncComponents.Control {...props}>
                <div
                  css={{
                    display: 'flex',
                    justifyContent: 'center',
                    paddingLeft: rem(6),
                    paddingRight: rem(3),
                  }}
                >
                  {leftIndicator}
                </div>
                {props.children}
              </reactAsyncComponents.Control>
            ),
          }
        : {}),

      ...components,
    },
    noOptionsMessage,
    styles: reactMultiSelectStyles(theme, !!validationMessage),
    ref: (ref: RefType<T>) => {
      inputRef = ref;
    },
    onFocus: checkValidation,
    onBlur: checkValidation,
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
    ...(creatable && {
      createOptionPosition: 'first',
      formatCreateLabel: (inputValue: string) => inputValue,
    }),
  };

  const SelectComponent = sortable ? SortableSelect : Select;
  const AsyncSelectComponent = sortable
    ? creatable
      ? SortableAsyncCreatableSelect
      : SortableAsyncSelect
    : AsyncSelect;

  return (
    <div css={containerStyles} onContextMenu={handleOnContextMenu}>
      {suggestions ? (
        <SelectComponent<T, true>
          {...commonProps}
          options={suggestions}
          maxMenuHeight={maxMenuHeight}
        />
      ) : (
        <AsyncSelectComponent<T, true>
          {...commonProps}
          loadOptions={loadOptions}
          cacheOptions
          defaultOptions
        />
      )}
      <input
        {...validationTargetProps}
        tabIndex={-1}
        autoComplete="off"
        onChange={noop}
        value={values.map((value) => value.label).join('')}
        required={required}
        disabled={!enabled}
        hidden
      />
      <div css={validationMessageStyles}>{validationMessage}</div>
    </div>
  );
};

export default MultiSelect;
