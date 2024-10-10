import { css, useTheme } from '@emotion/react';
import {
  ComponentProps,
  MouseEventHandler,
  ReactElement,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
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
import { MultiValueGenericProps } from 'react-select/src/components/MultiValue';
import {
  SortableContainer,
  SortableContainerProps,
  SortableElement,
  SortableHandle,
  SortEndHandler,
} from 'react-sortable-hoc';

import { pixels } from '..';
import { useValidation, validationMessageStyles } from '../form';
import { crossIcon } from '../icons';
import { reactMultiSelectStyles } from '../select';
import { noop } from '../utils';

const { rem } = pixels;

const indicatorStyles = css({
  display: 'flex',
  justifyContent: 'center',
  paddingLeft: rem(6),
  paddingRight: rem(3),
});

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

const containerStyles = (noMargin: boolean) =>
  css({
    flexBasis: '100%',
    marginTop: noMargin ? 0 : rem(15),
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

export type MultiSelectOnChange<T extends MultiSelectOptionsType> = (
  newValues: OptionsType<T>,
) => void;
export type SingleSelectOnChange<T extends MultiSelectOptionsType> = (
  newValues: T,
) => void;

export type MultiSelectProps<
  T extends MultiSelectOptionsType,
  M extends boolean = true,
> = {
  readonly customValidationMessage?: string;
  readonly id?: string;
  readonly enabled?: boolean;
  readonly placeholder?: string;
  readonly onChange?: M extends true
    ? MultiSelectOnChange<T>
    : SingleSelectOnChange<T>;
  readonly values?: M extends true ? OptionsType<T> : T;
  readonly sortable?: boolean;
  readonly creatable?: boolean;
  readonly required?: boolean;
  readonly getValidationMessage?: Parameters<typeof useValidation>[1];
  readonly maxMenuHeight?: number;
  readonly leftIndicator?: ReactNode;
  readonly noMargin?: boolean;
  readonly isMulti?: M;
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

const getValues = <T extends MultiSelectOptionsType, M extends boolean>(
  isMulti: M,
): M extends true ? OptionsType<T> : T =>
  (isMulti ? [] : {}) as M extends true ? OptionsType<T> : T;

const MultiSelect = <
  T extends MultiSelectOptionsType,
  M extends boolean = true,
>({
  customValidationMessage = '',
  loadOptions,
  id,
  suggestions,
  components,
  enabled = true,
  placeholder = '',
  maxMenuHeight,
  noOptionsMessage,
  onChange = noop,
  sortable = true,
  creatable = false,
  required = false,
  getValidationMessage,
  leftIndicator,
  noMargin = false,
  isMulti = true as M,
  values = getValues<T, M>(isMulti),
}: MultiSelectProps<T, M>): ReactElement => {
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

  if (sortable && isMulti && Array.isArray(values)) {
    const onSortEnd: SortEndHandler = ({ oldIndex, newIndex }) => {
      const newValue = arrayMove(values, oldIndex, newIndex);
      (onChange as (newValues: OptionsType<T>) => void)(newValue);
    };

    sortableProps = {
      useDragHandle: true,
      axis: 'xy',
      onSortEnd,
      // small fix for https://github.com/clauderic/react-sortable-hoc/pull/352:
      getHelperDimensions: ({ node }) => node.getBoundingClientRect(),
    };
  }

  const commonProps: Props<T, M> & Partial<SortableContainerProps> = {
    ...sortableProps,
    inputId: id,
    isDisabled: !enabled,
    isMulti,
    placeholder,
    backspaceRemovesValue: true,
    isClearable: true,
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
                <div css={indicatorStyles}>{leftIndicator}</div>
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
    onChange: (
      options: M extends true ? OptionsType<T> : T | null,
      actionMeta: ActionMeta<T>,
    ) => {
      switch (actionMeta.action) {
        case 'remove-value':
        case 'pop-value':
          if (actionMeta.removedValue && actionMeta.removedValue.isFixed) {
            return;
          }
          break;
      }
      if (isMulti && Array.isArray(options)) {
        (
          onChange as (
            newValues: OptionsType<T>,
            actionMeta: ActionMeta<T>,
          ) => void
        )(options, actionMeta);
      } else {
        (onChange as (newValues: T | null, actionMeta: ActionMeta<T>) => void)(
          options as T | null,
          actionMeta,
        );
      }
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
    <div css={containerStyles(noMargin)} onContextMenu={handleOnContextMenu}>
      {suggestions ? (
        <SelectComponent<T, typeof isMulti>
          {...commonProps}
          options={suggestions}
          maxMenuHeight={maxMenuHeight}
        />
      ) : (
        <AsyncSelectComponent<T, typeof isMulti>
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
        value={
          Array.isArray(values)
            ? values.map((value) => value.label).join(',')
            : values && 'label' in values
              ? values?.label || ''
              : undefined
        }
        required={required}
        disabled={!enabled}
        hidden
      />
      <div css={validationMessageStyles}>{validationMessage}</div>
    </div>
  );
};

export default MultiSelect;
