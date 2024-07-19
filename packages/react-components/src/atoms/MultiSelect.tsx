import { css, useTheme } from '@emotion/react';
import {
  ComponentProps,
  ReactElement,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
} from 'react';
import type { Options, Props, SelectInstance } from 'react-select';
import Select, {
  ActionMeta,
  components as reactAsyncComponents,
} from 'react-select';
import AsyncSelect from 'react-select/async';

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
  | (SelectInstance<T, true> & { getWrappedInstance: undefined })
  | {
      blur: undefined;
      getWrappedInstance: () => SelectInstance<T, true>;
    }
  | null;

export type MultiSelectProps<T extends MultiSelectOptionsType> = {
  readonly customValidationMessage?: string;
  readonly id?: string;
  readonly enabled?: boolean;
  readonly placeholder?: string;
  readonly onChange?: (newValues: Options<T>) => void;
  readonly values?: Options<T>;
  readonly sortable?: boolean;
  readonly creatable?: boolean;
  readonly required?: boolean;
  readonly getValidationMessage?: Parameters<typeof useValidation>[1];
  readonly maxMenuHeight?: number;
  readonly leftIndicator?: ReactNode;
  readonly noMargin?: boolean;
} & (
  | (Pick<Props<T, true>, 'noOptionsMessage' | 'components'> & {
      readonly suggestions: ReadonlyArray<T>;
      readonly loadOptions?: undefined;
    })
  | (Pick<Props<T, true>, 'noOptionsMessage' | 'components'> & {
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
  noMargin = false,
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

  const commonProps: Props<T, true> = {
    inputId: id,
    isDisabled: !enabled,
    isMulti: true as const,
    placeholder,
    value: values,
    components: {
      MultiValueRemove: reactAsyncComponents.MultiValueRemove,
      MultiValue: sortable ? reactAsyncComponents.MultiValue : undefined,
      MultiValueLabel: sortable
        ? reactAsyncComponents.MultiValueLabel
        : undefined,
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
    // ref: (ref: RefType<T>) => {
    //   inputRef = ref;
    // },
    onFocus: checkValidation,
    onBlur: checkValidation,
    onChange: (options: Options<T>, actionMeta: ActionMeta<T>) => {
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

  const SelectComponent = Select;
  const AsyncSelectComponent = AsyncSelect;

  return (
    <div css={containerStyles(noMargin)} onContextMenu={handleOnContextMenu}>
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
