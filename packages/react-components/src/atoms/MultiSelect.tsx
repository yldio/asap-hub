import { css, useTheme } from '@emotion/react';
import {
  ReactElement,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react';
import Select, {
  ActionMeta,
  components as reactAsyncComponents,
  GroupBase,
  Props,
  SelectInstance,
} from 'react-select';
import AsyncSelect from 'react-select/async';
import type { AsyncProps } from 'react-select/async';
import AsyncCreatableSelect from 'react-select/async-creatable';

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

export type MultiSelectOptionsType = {
  isFixed?: boolean;
  label: string;
  value: string;
};

export const MultiValueRemove: typeof reactAsyncComponents.MultiValueRemove = (
  props,
) => (
  <reactAsyncComponents.MultiValueRemove {...props}>
    {crossIcon}
  </reactAsyncComponents.MultiValueRemove>
);

const containerStyles = (noMargin: boolean) =>
  css({
    flexBasis: '100%',
    marginTop: noMargin ? 0 : rem(15),
  });

type RefType<T extends MultiSelectOptionsType, M extends boolean = true> =
  | SelectInstance<T, M, GroupBase<T>>
  | null;

export type MultiSelectOnChange<T extends MultiSelectOptionsType> = (
  newValues: readonly T[],
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
  readonly onFocus?: () => void;
  readonly onBlur?: () => void;
  readonly onChange?: M extends true
    ? MultiSelectOnChange<T>
    : SingleSelectOnChange<T>;
  readonly values?: M extends true ? readonly T[] : T | null;
  readonly creatable?: boolean;
  readonly required?: boolean;
  readonly getValidationMessage?: Parameters<typeof useValidation>[1];
  readonly maxMenuHeight?: number;
  readonly leftIndicator?: ReactNode;
  readonly noMargin?: boolean;
  readonly isMulti?: M;
} & (
  | (Pick<
      Props<T, true, GroupBase<T>>,
      'noOptionsMessage' | 'components'
    > & {
      readonly suggestions: ReadonlyArray<T>;
      readonly loadOptions?: undefined;
    })
  | (Pick<
      AsyncProps<T, true, GroupBase<T>>,
      'noOptionsMessage' | 'components'
    > & {
      readonly loadOptions: (
        inputValue: string,
        callback: (options: ReadonlyArray<T>) => void,
      ) => Promise<ReadonlyArray<T>> | void;
      readonly suggestions?: undefined;
    })
);

const getValues = <T extends MultiSelectOptionsType, M extends boolean>(
  isMulti: M,
): M extends true ? readonly T[] : T | null =>
  (isMulti ? [] : {}) as M extends true ? readonly T[] : T | null;

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
  onFocus = noop,
  onBlur = noop,
  onChange = noop,
  creatable = false,
  required = false,
  getValidationMessage,
  leftIndicator,
  noMargin = false,
  isMulti = true as M,
  values = getValues<T, M>(isMulti),
}: MultiSelectProps<T, M>): ReactElement => {
  const theme = useTheme();
  let inputRef: RefType<T, M> = null;
  const handleOnContextMenu = () => {
    inputRef?.blur?.();
  };

  const { validationMessage, validationTargetProps, validate } =
    useValidation<HTMLInputElement>(
      customValidationMessage,
      getValidationMessage,
    );

  const [hasBlurred, setHasBlurred] = useState(false);
  const previousValues = useRef(values);

  useEffect(() => {
    if (hasBlurred && previousValues.current !== values) {
      validate();
    }
    previousValues.current = values;
  }, [values, hasBlurred, validate]);

  const commonProps: Props<T, M, GroupBase<T>> = {
    inputId: id,
    isDisabled: !enabled,
    isMulti,
    placeholder,
    backspaceRemovesValue: true,
    isClearable: true,
    value: values ?? getValues<T, M>(isMulti),
    components: {
      MultiValueRemove,
      ...(leftIndicator
        ? {
            Control: (props: Parameters<typeof reactAsyncComponents.Control>[0]) => (
              <reactAsyncComponents.Control {...props}>
                <div css={indicatorStyles}>{leftIndicator}</div>
                {props.children}
              </reactAsyncComponents.Control>
            ),
          }
        : {}),

      ...components,
    } as Props<T, M, GroupBase<T>>['components'],
    noOptionsMessage,
    styles: reactMultiSelectStyles(theme, !!validationMessage, isMulti),
    onFocus: () => {
      if (onFocus) {
        onFocus();
      }
    },
    onBlur: () => {
      setHasBlurred(true);
      validate();
      onBlur();
    },
    onChange: (
      options: M extends true ? readonly T[] : T | null,
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
            newValues: readonly T[],
            actionMeta: ActionMeta<T>,
          ) => void
        )(options, actionMeta);
      } else {
        (onChange as (newValues: T | null, actionMeta: ActionMeta<T>) => void)(
          options as T | null,
          actionMeta,
        );
      }
      onBlur();
    },
    ...(creatable && {
      createOptionPosition: 'first' as const,
      formatCreateLabel: (inputValue: string) => inputValue,
    }),
  };

  return (
    <div css={containerStyles(noMargin)} onContextMenu={handleOnContextMenu}>
      {suggestions ? (
        <Select<T, typeof isMulti, GroupBase<T>>
          {...commonProps}
          ref={(ref) => {
            inputRef = ref;
          }}
          options={suggestions as T[]}
          maxMenuHeight={maxMenuHeight}
        />
      ) : creatable ? (
        <AsyncCreatableSelect<T, typeof isMulti, GroupBase<T>>
          {...commonProps}
          ref={(ref) => {
            inputRef = ref;
          }}
          loadOptions={loadOptions}
          cacheOptions
          defaultOptions
          maxMenuHeight={maxMenuHeight}
        />
      ) : (
        <AsyncSelect<T, typeof isMulti, GroupBase<T>>
          {...commonProps}
          ref={(ref) => {
            inputRef = ref;
          }}
          loadOptions={loadOptions}
          cacheOptions
          defaultOptions
          maxMenuHeight={maxMenuHeight}
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
            : typeof values === 'object' && values !== null && 'label' in values
              ? values.label ?? ''
              : ''
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
