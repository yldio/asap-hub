import { ComponentProps } from 'react';
import Select, { StylesConfig } from 'react-select';
import { CSSObject } from '@emotion/serialize';

import { ellipsisStyles } from './atoms/Ellipsis';
import {
  ember,
  rose,
  lead,
  silver,
  tin,
  steel,
  mint,
  pine,
  charcoal,
  paper,
} from './colors';
import {
  styles,
  indicatorPadding,
  borderWidth,
  paddingLeftRight,
} from './form';
import { perRem, lineHeight } from './pixels';
import { MultiSelectOptionType } from './atoms/MultiSelect';

export interface Option<V extends string> {
  value: V;
  label: string;
}

const { ':focus': focusStyles, ...baseStyles } = styles;

const disabledStyles = {
  color: lead.rgb,
  svg: {
    fill: lead.rgb,
  },
  backgroundColor: silver.rgb,
};

const baseSelectStyles = {
  input: () => ({
    width: '100%',
    input: {
      width: '100% !important',
    },
  }),
  indicatorSeparator: () => ({
    padding: `0 ${3 / perRem}em`,
  }),
  indicatorsContainer: (provided: CSSObject) => ({
    ...provided,

    minWidth: `${lineHeight / perRem}em`,
    minHeight: `${lineHeight / perRem}em`,
    paddingRight: `${3 / perRem}em`,

    justifyContent: 'flex-end',
    alignItems: 'center',
  }),

  menu: (provided: CSSObject) => ({
    ...provided,

    margin: 0,
    paddingTop: `${9 / perRem}em`,

    borderRadius: 0,
    boxShadow: `0px 2px 4px ${steel.rgb}`,
  }),
  menuList: (provided: CSSObject) => ({
    ...provided,

    borderStyle: 'solid',
    borderWidth: `${borderWidth / perRem}em`,
    borderColor: steel.rgb,
  }),

  noOptionsMessage: () => ({
    ...disabledStyles,
    padding: `${12 / perRem}em ${paddingLeftRight / perRem}em`,
  }),
};

export const reactSelectStyles = (
  isInvalid: boolean,
): ComponentProps<typeof Select>['styles'] => ({
  ...baseSelectStyles,
  option: (provided, { isFocused }) => ({
    ...provided,

    padding: `${12 / perRem}em ${paddingLeftRight / perRem}em`,

    backgroundColor: isFocused ? mint.rgb : 'unset',
    color: isFocused ? pine.rgb : 'unset',
    ':active': undefined,
  }),
  control: (_provided, { isFocused, isDisabled }) => ({
    ...baseStyles,

    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',

    ...(isFocused ? focusStyles : {}),
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
    paddingRight: `${indicatorPadding / perRem}em`,
  }),
  placeholder: (provided) => ({
    ...provided,
    color: lead.rgb,
  }),
  multiValue: (provided) => ({
    ...provided,
    paddingLeft: 0,
  }),
});

export const reactMultiSelectStyles = <T extends MultiSelectOptionType>(
  isInvalid: boolean,
): StylesConfig<T, true> => ({
  ...baseSelectStyles,
  option: (provided, { isFocused }) => ({
    ...provided,

    padding: `${12 / perRem}em ${paddingLeftRight / perRem}em`,

    backgroundColor: isFocused ? mint.rgb : 'unset',
    color: isFocused ? pine.rgb : 'unset',
    ':active': undefined,
  }),
  control: (_provided, { isFocused, isDisabled }) => ({
    ...baseStyles,
    padding: `${3 / perRem}em ${9 / perRem}em`,

    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',

    ...(isFocused ? focusStyles : {}),
    ...(isInvalid
      ? {
          borderColor: isFocused ? pine.rgb : ember.rgb,
          backgroundColor: isFocused ? paper.rgb : rose.rgb,
          svg: { fill: 'unset' },
        }
      : {}),
    ...(isDisabled ? disabledStyles : {}),
  }),
  multiValue: () => ({
    padding: `${5 / perRem}em ${15 / perRem}em ${5 / perRem}em`,
    margin: `${5 / perRem}em ${6 / perRem}em ${5 / perRem}em`,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',

    borderStyle: 'solid',
    borderWidth: `${borderWidth}px`,
    borderColor: steel.rgb,
    borderRadius: `${18 / perRem}em`,
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
          marginLeft: `${9 / perRem}em`,
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
  input: (provided) => ({
    ...provided,
    padding: `${5 / perRem}em 0 ${5 / perRem}em`,
    margin: `${6 / perRem}em ${6 / perRem}em ${6 / perRem}em`,
  }),
  placeholder: (provided) => ({
    ...provided,
    marginLeft: `${6 / perRem}em`,
  }),
});
