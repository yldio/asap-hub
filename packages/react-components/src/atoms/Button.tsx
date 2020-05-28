import React from 'react';
import css from '@emotion/css';

import {
  fern,
  pine,
  paper,
  OpaqueColor,
  lead,
  steel,
  charcoal,
  silver,
} from '../colors';
import { pixelsPerRem } from '../lengths';

const borderWidth = 1;
const styles = css({
  outline: 'none',

  borderStyle: 'solid',
  borderWidth: `${borderWidth}px`,
  borderRadius: '4px',

  fontWeight: 'bold',
});

// TODO different paddings for icon-only buttons
const largeStyles = css({
  height: `${(54 + 2 * borderWidth) / pixelsPerRem}em`,

  marginTop: `${(18 - 2 * borderWidth) / pixelsPerRem}em`,
  marginBottom: `${(18 - 2 * borderWidth) / pixelsPerRem}em`,

  paddingTop: `${15 / pixelsPerRem}em`,
  paddingBottom: `${15 / pixelsPerRem}em`,
  paddingLeft: `${42 / pixelsPerRem}em`,
  paddingRight: `${42 / pixelsPerRem}em`,
});
const smallStyles = css({
  height: `${(36 + 2 * borderWidth) / pixelsPerRem}em`,

  marginTop: `${(12 - 2 * borderWidth) / pixelsPerRem}em`,
  marginBottom: `${(12 - 2 * borderWidth) / pixelsPerRem}em`,

  paddingTop: `${9 / pixelsPerRem}em`,
  paddingBottom: `${9 / pixelsPerRem}em`,
  paddingLeft: `${12 / pixelsPerRem}em`,
  paddingRight: `${12 / pixelsPerRem}em`,
});

const boxShadow = (color: OpaqueColor) => `0px 2px 4px -2px ${color.rgb}`;
const primaryStyles = css({
  color: paper.rgb,

  backgroundColor: fern.rgb,
  borderColor: pine.rgb,
  boxShadow: boxShadow(pine),

  ':hover, :focus': {
    backgroundColor: pine.rgb,
    borderColor: pine.rgb,
    boxShadow: boxShadow(lead),
  },

  ':active': {
    backgroundColor: pine.rgb,
    borderColor: pine.rgb,
    boxShadow: 'none',
  },
});
const secondaryStyles = css({
  backgroundColor: paper.rgb,
  borderColor: steel.rgb,
  boxShadow: boxShadow(steel),

  ':hover, :focus': {
    borderColor: charcoal.rgb,
    boxShadow: boxShadow(steel),
  },

  ':active': {
    borderColor: steel.rgb,
    boxShadow: 'none',
  },
});
const disabledStyles = css({
  backgroundColor: silver.rgb,
  borderColor: steel.rgb,
  boxShadow: 'none',
});

interface ButtonProps {
  enabled?: boolean;
  primary?: boolean;
  small?: boolean;
  children?: React.ReactText | ReadonlyArray<React.ReactText>;
}
const Button: React.FC<ButtonProps> = ({
  enabled = true,
  primary = false,
  small = false,
  children,
}) => (
  <button
    disabled={!enabled}
    css={[
      styles,
      small ? smallStyles : largeStyles,
      enabled ? (primary ? primaryStyles : secondaryStyles) : disabledStyles,
    ]}
  >
    {children}
  </button>
);

export default Button;
