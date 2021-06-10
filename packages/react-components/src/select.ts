import { ComponentProps } from 'react';
import Select from 'react-select';
import { ember, rose, lead, silver, tin, steel, mint, pine } from './colors';
import {
  styles,
  indicatorPadding,
  borderWidth,
  paddingLeftRight,
} from './form';
import { perRem, lineHeight } from './pixels';

export interface Option<V extends string> {
  value: V;
  label: string;
}

const { ':focus': focusStyles, ...baseStyles } = styles;

const invalidStyles = {
  color: ember.rgb,
  borderColor: ember.rgb,
  backgroundColor: rose.rgb,
};

const disabledStyles = {
  color: lead.rgb,
  svg: {
    fill: lead.rgb,
  },
  backgroundColor: silver.rgb,
};

export const reactSelectStyles = (
  isInvalid: boolean,
): ComponentProps<typeof Select>['styles'] => ({
  control: (_provided, { isFocused, isDisabled }) => ({
    ...baseStyles,

    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',

    ...(isFocused ? focusStyles : {}),
    ...(isInvalid ? invalidStyles : {}),
    ...(isDisabled ? disabledStyles : {}),
  }),

  valueContainer: (provided) => ({
    ...provided,
    padding: 0,
    paddingRight: `${indicatorPadding / perRem}em`,
  }),
  input: (_provided) => ({}),
  singleValue: (provided, { getValue }) => ({
    ...provided,
    margin: 0,
    color: getValue()?.some((option) => option.value !== '')
      ? 'unset'
      : tin.rgb,
  }),

  indicatorSeparator: (_provided) => ({ display: 'none' }),
  indicatorsContainer: (provided) => ({
    ...provided,

    minWidth: `${lineHeight / perRem}em`,
    minHeight: `${lineHeight / perRem}em`,

    justifyContent: 'center',
    alignItems: 'center',
  }),

  menu: (provided) => ({
    ...provided,

    margin: 0,
    paddingTop: `${9 / perRem}em`,
    paddingBottom: `${18 / perRem}em`,

    borderRadius: 0,
    boxShadow: 'none',
  }),
  menuList: (provided) => ({
    ...provided,

    borderStyle: 'solid',
    borderWidth: `${borderWidth / perRem}em`,
    borderColor: steel.rgb,
  }),
  option: (provided, { isFocused }) => ({
    ...provided,

    padding: `${12 / perRem}em ${paddingLeftRight / perRem}em`,

    backgroundColor: isFocused ? mint.rgb : 'unset',
    color: isFocused ? pine.rgb : 'unset',
    ':active': undefined,
  }),

  noOptionsMessage: (_provided) => ({
    padding: `${12 / perRem}em ${paddingLeftRight / perRem}em`,
  }),
});
