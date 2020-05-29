import React from 'react';
import css from '@emotion/css';

import {
  fern,
  pine,
  paper,
  OpaqueColor,
  lead,
  steel,
  tin,
  charcoal,
  silver,
} from '../colors';
import { pixelsPerRem } from '../lengths';

const borderWidth = 1;
const styles = css({
  display: 'inline-flex',
  alignItems: 'center',
  '> span': {
    whiteSpace: 'pre',
  },

  outline: 'none',

  borderStyle: 'solid',
  borderWidth: `${borderWidth}px`,
  borderRadius: '4px',

  fontWeight: 'bold',
});

const largeStyles = css({
  height: `${(54 + 2 * borderWidth) / pixelsPerRem}em`,
  '> svg': {
    height: `${24 / pixelsPerRem}em`,
  },
  '> svg + span': {
    marginLeft: `${12 / pixelsPerRem}em`,
  },
  '> span + svg': {
    marginLeft: `${12 / pixelsPerRem}em`,
  },

  marginTop: `${(18 - 2 * borderWidth) / pixelsPerRem}em`,
  marginBottom: `${(18 - 2 * borderWidth) / pixelsPerRem}em`,

  paddingTop: `${15 / pixelsPerRem}em`,
  paddingBottom: `${15 / pixelsPerRem}em`,
  paddingLeft: `${18 / pixelsPerRem}em`,
  paddingRight: `${18 / pixelsPerRem}em`,
});
const smallStyles = css({
  height: `${(36 + 2 * borderWidth) / pixelsPerRem}em`,
  '> svg': {
    height: `${18 / pixelsPerRem}em`,
  },
  '> svg + span': {
    marginLeft: `${6 / pixelsPerRem}em`,
  },
  '> span + svg': {
    marginLeft: `${6 / pixelsPerRem}em`,
  },

  marginTop: `${(12 - 2 * borderWidth) / pixelsPerRem}em`,
  marginBottom: `${(12 - 2 * borderWidth) / pixelsPerRem}em`,

  paddingTop: `${9 / pixelsPerRem}em`,
  paddingBottom: `${9 / pixelsPerRem}em`,
  paddingLeft: `${12 / pixelsPerRem}em`,
  paddingRight: `${12 / pixelsPerRem}em`,
});

const largeTextOnlyStyles = css({
  paddingLeft: `${42 / pixelsPerRem}em`,
  paddingRight: `${42 / pixelsPerRem}em`,
});
const largeIconOnlyStyles = css({
  paddingLeft: `${15 / pixelsPerRem}em`,
  paddingRight: `${15 / pixelsPerRem}em`,
});
const smallIconOnlyStyles = css({
  paddingLeft: `${9 / pixelsPerRem}em`,
  paddingRight: `${9 / pixelsPerRem}em`,
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
  color: tin.rgb,
  backgroundColor: silver.rgb,
  borderColor: steel.rgb,
  boxShadow: 'none',
});

interface ButtonProps {
  enabled?: boolean;
  primary?: boolean;
  small?: boolean;

  children?: React.ReactNode | React.ReactNodeArray;

  onClick?: React.ButtonHTMLAttributes<HTMLButtonElement>['onClick'];
}
const Button: React.FC<ButtonProps> = ({
  enabled = true,
  primary = false,
  small = false,

  children,

  onClick,
}) => (
  <button
    disabled={!enabled}
    onClick={onClick}
    css={[
      styles,
      small ? smallStyles : largeStyles,
      enabled ? (primary ? primaryStyles : secondaryStyles) : disabledStyles,
      (Array.isArray(children)
        ? children.some((child) => child && typeof child === 'object')
        : children && typeof children === 'object') ||
        (small ? null : largeTextOnlyStyles),
      (Array.isArray(children)
        ? children.some((child) => typeof child === 'string')
        : typeof children === 'string') ||
        (small ? smallIconOnlyStyles : largeIconOnlyStyles),
    ]}
  >
    {Array.isArray(children) ? (
      children.map((child) =>
        typeof child === 'string' ? <span key={child}>{child}</span> : child,
      )
    ) : typeof children === 'string' ? (
      <span>{children}</span>
    ) : (
      children
    )}
  </button>
);

export default Button;
