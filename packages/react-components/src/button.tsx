import React from 'react';
import css from '@emotion/css';

import { formTargetWidth, perRem } from './pixels';
import {
  OpaqueColor,
  paper,
  fern,
  pine,
  lead,
  steel,
  charcoal,
  tin,
  silver,
  color,
} from './colors';

const activeBackgroundColor = color(122, 210, 169, 0.18);
const borderWidth = 1;
const styles = css({
  flexGrow: 1,

  display: 'inline-flex',
  justifyContent: 'center',
  alignItems: 'center',
  whiteSpace: 'pre',

  maxWidth: `${formTargetWidth / perRem}em`,

  outline: 'none',

  boxSizing: 'border-box',
  borderStyle: 'solid',
  borderWidth: `${borderWidth / perRem}em`,
  borderRadius: `${4 / perRem}em`,

  cursor: 'pointer',

  lineHeight: 'unset',
  fontWeight: 'bold',

  '+ button': {
    marginTop: 0,
  },

  transition: '200ms',
});

const largeStyles = css({
  height: `${54 / perRem}em`,
  '> svg': {
    height: `${24 / perRem}em`,
    width: 'auto',
  },
  '> svg + span': {
    marginLeft: `${12 / perRem}em`,
  },
  '> span + svg': {
    marginLeft: `${12 / perRem}em`,
  },

  marginTop: `${16 / perRem}em`,
  marginBottom: `${16 / perRem}em`,

  paddingTop: `${(15 - borderWidth) / perRem}em`,
  paddingBottom: `${(15 - borderWidth) / perRem}em`,
  paddingLeft: `${(18 - borderWidth) / perRem}em`,
  paddingRight: `${(18 - borderWidth) / perRem}em`,
});
const smallStyles = css({
  height: `${36 / perRem}em`,
  '> svg': {
    height: `${18 / perRem}em`,
    width: 'auto',
  },
  '> svg + span': {
    marginLeft: `${6 / perRem}em`,
  },
  '> span + svg': {
    marginLeft: `${6 / perRem}em`,
  },

  marginTop: `${12 / perRem}em`,
  marginBottom: `${12 / perRem}em`,

  paddingTop: `${(9 - borderWidth) / perRem}em`,
  paddingBottom: `${(9 - borderWidth) / perRem}em`,
  paddingLeft: `${(12 - borderWidth) / perRem}em`,
  paddingRight: `${(12 - borderWidth) / perRem}em`,
});

const largeTextOnlyStyles = css({
  paddingLeft: `${(42 - borderWidth) / perRem}em`,
  paddingRight: `${(42 - borderWidth) / perRem}em`,
});
const largeIconOnlyStyles = css({
  paddingLeft: `${(15 - borderWidth) / perRem}em`,
  paddingRight: `${(15 - borderWidth) / perRem}em`,
});
const smallIconOnlyStyles = css({
  paddingLeft: `${(9 - borderWidth) / perRem}em`,
  paddingRight: `${(9 - borderWidth) / perRem}em`,
});

const boxShadow = (opaqueColor: OpaqueColor) =>
  `0px 2px 4px -2px ${opaqueColor.rgb}`;
const primaryStyles = css({
  color: paper.rgb,

  backgroundColor: fern.rgb,
  borderColor: pine.rgb,
  boxShadow: boxShadow(pine),
  svg: {
    stroke: paper.rgb,
  },
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

  cursor: 'unset',

  svg: {
    stroke: tin.rgb,
  },
});

export const activeStyles = css({
  backgroundColor: activeBackgroundColor.rgba,
  borderColor: 'transparent',
  color: pine.rgb,
  svg: {
    stroke: pine.rgb,
  },
  ':hover, :focus': {
    backgroundColor: activeBackgroundColor.rgba,
    color: pine.rgb,
  },
});

export const getButtonStyles = ({
  primary = false,
  small = false,
  enabled = true,
  active = false,
  children = [] as React.ReactNode,
}) =>
  css([
    styles,
    small ? smallStyles : largeStyles,
    enabled
      ? active
        ? activeStyles
        : primary
        ? primaryStyles
        : secondaryStyles
      : disabledStyles,
    (Array.isArray(children)
      ? children.some((child) => child && typeof child === 'object')
      : children && typeof children === 'object') ||
      (small ? null : largeTextOnlyStyles),
    (Array.isArray(children)
      ? children.some((child) => typeof child === 'string')
      : typeof children === 'string') ||
      (small ? smallIconOnlyStyles : largeIconOnlyStyles),
  ]);

export const getButtonChildren = (children = [] as React.ReactNode) =>
  Array.isArray(children) ? (
    children.map((child) =>
      typeof child === 'string' ? <span key={child}>{child}</span> : child,
    )
  ) : typeof children === 'string' ? (
    <span>{children}</span>
  ) : (
    children
  );
