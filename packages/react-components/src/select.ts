import { Theme } from '@emotion/react';
import { CSSObject } from '@emotion/serialize';
import { GroupBase, StylesConfig } from 'react-select';
import { ellipsisStyles } from './atoms/Ellipsis';
import { MultiSelectOptionsType } from './atoms/MultiSelect';
import {
  charcoal,
  ember,
  fern,
  lead,
  mint,
  paper,
  pine,
  rose,
  silver,
  steel,
  tin,
} from './colors';
import {
  borderWidth,
  indicatorPadding,
  paddingLeftRight,
  styles,
} from './form';
import { lineHeight, rem } from './pixels';

export interface Option<V extends string> {
  value: V;
  label: string;
  disabled?: boolean;
}

// Compatibility type for v5 migration (replaces react-select's removed OptionsType)
export type OptionsType<T> = readonly T[];

const { ...baseStyles } = styles;

const disabledStyles = {
  color: lead.rgb,
  svg: {
    fill: lead.rgb,
  },
  backgroundColor: silver.rgb,
};

const baseSelectStyles = {
  input: (provided: CSSObject) => ({
    ...provided,
    padding: 0,
    margin: '0 2px',
    width: '100%',
    color: charcoal.rgb,
    input: {
      width: '100% !important',
      color: `${charcoal.rgb} !important`,
    },
  }),
  indicatorSeparator: () => ({
    padding: `0 ${rem(6)}`,
  }),
  indicatorsContainer: (provided: CSSObject) => ({
    ...provided,

    minWidth: rem(lineHeight),
    minHeight: rem(lineHeight),
    paddingRight: rem(3),

    justifyContent: 'flex-end',
    alignItems: 'center',
  }),

  menu: (provided: CSSObject) => ({
    ...provided,

    margin: 0,
    paddingTop: rem(9),

    borderRadius: 0,
    boxShadow: `0px 2px 4px ${steel.rgb}`,
  }),
  menuList: (provided: CSSObject) => ({
    ...provided,

    borderStyle: 'solid',
    borderWidth: rem(borderWidth),
    borderColor: steel.rgb,
  }),

  noOptionsMessage: () => ({
    ...disabledStyles,
    padding: `${rem(12)} ${rem(paddingLeftRight)}`,
  }),
};

export const reactSelectStyles = <
  T extends { value: string; label: string } = { value: string; label: string },
  M extends boolean = boolean,
>(
  {
    colors: { primary100 = mint, primary500 = fern, primary900 = pine } = {},
  }: Theme,
  isInvalid: boolean,
): StylesConfig<T, M, GroupBase<T>> =>
  ({
    ...baseSelectStyles,
    option: (provided, { isFocused }) => ({
      ...provided,

      padding: `${rem(12)} ${rem(paddingLeftRight)}`,

      backgroundColor: isFocused ? primary100.rgba : 'unset',
      color: isFocused ? primary900.rgba : 'unset',
      ':active': undefined,
    }),
    control: (_provided, { isFocused, isDisabled }) => ({
      ...baseStyles,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',

      ...(isFocused ? { borderColor: primary500.rgba } : {}),
      ...(isInvalid
        ? {
            color: ember.rgb,
            borderColor: ember.rgb,
            backgroundColor: rose.rgb,
          }
        : {}),
      ...(isDisabled ? disabledStyles : {}),
    }),
    singleValue: (provided, { getValue }) => ({
      ...provided,
      margin: 0,
      color: getValue()?.some((option) => option.value !== '')
        ? 'unset'
        : tin.rgb,
    }),
    valueContainer: (provided) => ({
      ...provided,
      padding: 0,
      paddingRight: rem(indicatorPadding),
    }),
    placeholder: (provided) => ({
      ...provided,
      color: isInvalid ? ember.rgb : lead.rgb,
      opacity: isInvalid ? 0.4 : provided.opacity,
    }),
    menu: (provided: CSSObject) => ({
      ...provided,

      zIndex: 300,
    }),
  }) as StylesConfig<T, M, GroupBase<T>>;

export const reactMultiSelectStyles = <
  T extends MultiSelectOptionsType,
  M extends boolean = true,
>(
  {
    colors: { primary100 = mint, primary500 = fern, primary900 = pine } = {},
  }: Theme,
  isInvalid: boolean,
  isMulti: boolean,
): StylesConfig<T, M, GroupBase<T>> =>
  ({
    ...baseSelectStyles,
    option: (provided, { isFocused }) => ({
      ...provided,

      padding: `${rem(12)} ${rem(paddingLeftRight)}`,

      backgroundColor: isFocused ? primary100.rgba : 'unset',
      color: isFocused ? primary900.rgba : 'unset',
      ':active': undefined,
    }),
    control: (_provided, { isFocused, isDisabled }) => ({
      ...baseStyles,
      padding: `${rem(3)} ${rem(9)}`,

      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',

      ...(isFocused ? { borderColor: primary500.rgba } : {}),
      ...(isInvalid
        ? {
            borderColor: isFocused ? primary900.rgba : ember.rgb,
            backgroundColor: isFocused ? paper.rgb : rose.rgb,
            svg: { fill: 'unset' },
          }
        : {}),
      ...(isDisabled ? disabledStyles : {}),
    }),
    multiValue: () => ({
      padding: `${rem(5)} ${rem(15)} ${rem(5)}`,
      margin: `${rem(5)} ${rem(6)} ${rem(5)}`,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',

      borderStyle: 'solid',
      borderWidth: `${borderWidth}px`,
      borderColor: isInvalid ? tin.rgba : steel.rgb,
      borderRadius: rem(18),
      backgroundColor: paper.rgb,
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      ...ellipsisStyles,
      padding: 0,
      color: charcoal.rgb,
      fontSize: 'unset',
    }),
    multiValueRemove: (provided, state) =>
      state.data.isFixed
        ? { ...provided, display: 'none' }
        : {
            ...provided,
            padding: 0,
            marginLeft: rem(9),
            display: 'flex',
            cursor: 'pointer',
            svg: { width: '12px', height: '12px', strokeWidth: '2.5' },
            ':hover': {},
          },
    indicatorsContainer: () => ({ display: 'none' }),
    valueContainer: (provided) => ({
      ...provided,
      padding: 0,
    }),
    input: (provided, state) => {
      const hasSingleSelectedValue =
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        !isMulti && Object.keys((state as any).selectProps.value).length > 0;

      return {
        ...provided,
        ...(hasSingleSelectedValue
          ? {
              margin: 0,
            }
          : {
              padding: `${rem(5)} 0 ${rem(5)}`,
              margin: `${rem(6)} ${rem(6)} ${rem(6)}`,
            }),
      };
    },
    placeholder: (provided) => ({
      ...provided,
      color: isInvalid ? ember.rgb : provided.color,
      opacity: isInvalid ? 0.4 : provided.opacity,
      marginLeft: rem(6),
    }),
  }) as StylesConfig<T, M, GroupBase<T>>;
