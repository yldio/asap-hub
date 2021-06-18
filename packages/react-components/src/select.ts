import { ComponentProps } from 'react';
import Select from 'react-select';
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
} from './colors';
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

const baseSelectStyles: ComponentProps<typeof Select>['styles'] = {
  input: (_provided) => ({}),
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
};

export const reactSelectStyles = (
  isInvalid: boolean,
): ComponentProps<typeof Select>['styles'] => ({
  ...baseSelectStyles,
  control: (_provided, { isFocused, isDisabled }) => ({
    ...baseStyles,

    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',

    ...(isFocused ? focusStyles : {}),
    ...(isInvalid ? invalidStyles : {}),
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
});

export const reactMultiSelectStyles = (
  isInvalid: boolean,
): ComponentProps<typeof Select>['styles'] => ({
  ...baseSelectStyles,
  control: (_provided, { isFocused, isDisabled }) => ({
    ...baseStyles,
    padding: `${3 / perRem}em ${9 / perRem}em`,

    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',

    ...(isFocused ? focusStyles : {}),
    ...(isInvalid
      ? { ...invalidStyles, backgroundColor: 'unset', svg: { fill: 'unset' } }
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
  }),
  multiValueLabel: (provided) => ({
    ...provided,
    padding: 0,
    color: charcoal.rgb,
    fontSize: 'unset',
  }),
  multiValueRemove: (provided) => ({
    ...provided,
    width: '7px',
    height: '7px',
  }),
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
