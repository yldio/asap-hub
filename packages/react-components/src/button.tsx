import { css, Theme } from '@emotion/react';

import {
  charcoal,
  color,
  error500,
  error900,
  fern,
  lead,
  OpaqueColor,
  paper,
  pine,
  silver,
  steel,
  tin,
  TransparentColor,
} from './colors';
import { formTargetWidth, mobileScreen, perRem, rem } from './pixels';

export const activePrimaryBackgroundColorDefault = color(122, 210, 169, 0.18);

const borderWidth = 1;
const styles = css({
  flexGrow: 1,
  display: 'inline-flex',
  justifyContent: 'center',
  textAlign: 'center',

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

  [`@media (max-width: ${mobileScreen.max}px)`]: {
    flexGrow: 1,
    minWidth: '100%',
  },
});

const fullWidthStyles = css({
  flexGrow: 1,
  minWidth: '100%',
});

const largeStyles = css({
  '> svg': {
    height: `${24 / perRem}em`,
    width: 'auto',
  },
  '> svg + span': {
    marginLeft: rem(10),
  },
  ':has(> svg + span)': {
    paddingLeft: `${(24 - borderWidth) / perRem}em`,
  },
  '> span + svg': {
    marginLeft: rem(10),
  },
  ':has(> span + svg )': {
    paddingRight: `${(24 - borderWidth) / perRem}em`,
  },

  paddingTop: `${(15 - borderWidth) / perRem}em`,
  paddingBottom: `${(15 - borderWidth) / perRem}em`,
  paddingLeft: `${(32 - borderWidth) / perRem}em`,
  paddingRight: `${(32 - borderWidth) / perRem}em`,
});

const largeWithSpaceStyles = css({
  marginTop: `${18 / perRem}em`,
  marginBottom: `${18 / perRem}em`,
});
const smallWithSpaceStyles = css({
  marginTop: `${12 / perRem}em`,
  marginBottom: `${12 / perRem}em`,
});

const smallStyles = css({
  '> svg': {
    height: `${18 / perRem}em`,
    paddingTop: `${3 / perRem}em`,
    paddingBottom: `${3 / perRem}em`,
    width: 'auto',
  },
  '> svg + span': {
    marginLeft: rem(6),
  },
  ':has(> svg + span)': {
    paddingLeft: rem(8 - borderWidth),
  },
  '> span + svg': {
    marginLeft: rem(6),
  },
  ':has(> span + svg )': {
    paddingRight: rem(8 - borderWidth),
  },

  paddingTop: `${(6 - borderWidth) / perRem}em`,
  paddingBottom: `${(6 - borderWidth) / perRem}em`,
  paddingLeft: `${(16 - borderWidth) / perRem}em`,
  paddingRight: `${(16 - borderWidth) / perRem}em`,
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

const boxShadow = (opaqueColor: OpaqueColor | TransparentColor) =>
  `0px 2px 4px -2px ${opaqueColor.rgba}`;

const primaryStyles = ({
  primary500 = fern,
  primary900 = pine,
}: Theme['colors'] = {}) =>
  css({
    color: paper.rgb,

    backgroundColor: primary500.rgba,
    borderColor: primary900.rgba,
    boxShadow: boxShadow(primary900),
    svg: {
      stroke: paper.rgb,
    },
    ':hover, :focus': {
      backgroundColor: primary900.rgba,
      borderColor: primary900.rgba,
      boxShadow: boxShadow(lead),
    },

    ':active': {
      backgroundColor: primary900.rgba,
      borderColor: primary900.rgba,
      boxShadow: 'none',
      color: paper.rgb,
    },
  });
export const secondaryStyles = css({
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

export const warningStyles = css({
  backgroundColor: error500.rgb,
  color: paper.rgb,
  borderColor: error900.rgb,
  boxShadow: boxShadow(steel),

  ':hover, :focus, :active': {
    backgroundColor: error900.rgb,
    boxShadow: 'none',
  },
});

const disabledStyles = css({
  color: lead.rgb,
  backgroundColor: silver.rgb,
  borderColor: steel.rgb,
  boxShadow: 'none',

  cursor: 'unset',

  svg: {
    filter: 'grayscale(1)',
    stroke: tin.rgb,
  },
});

export const activePrimaryStyles = ({
  primary100 = activePrimaryBackgroundColorDefault,
  primary900 = pine,
}: Theme['colors'] = {}) =>
  css({
    backgroundColor: primary100.rgba,
    borderColor: 'transparent',
    color: primary900.rgba,
    svg: {
      stroke: primary900.rgba,
    },
    ':hover, :focus': {
      backgroundColor: primary100.rgba,
      color: primary900.rgba,
    },
  });
export const activeSecondaryStyles = css({
  backgroundColor: paper.rgb,
  color: charcoal.rgb,
  borderColor: charcoal.rgb,

  svg: {
    stroke: charcoal.rgb,
  },
  ':hover, :focus': {
    backgroundColor: paper.rgb,
    color: charcoal.rgb,
    borderColor: charcoal.rgb,
  },
});

export const getButtonStyles = ({
  primary = false,
  warning = false,
  small = false,
  enabled = true,
  active = false,
  children = [] as React.ReactNode,
  noMargin = false,
  fullWidth = false,
  colors,
}: {
  colors?: Theme['colors'];
  primary?: boolean;
  warning?: boolean;
  small?: boolean;
  enabled?: boolean;
  active?: boolean;
  noMargin?: boolean;
  fullWidth?: boolean;
  children?: React.ReactNode;
}) =>
  css([
    styles,
    small ? smallStyles : largeStyles,
    !noMargin && small && smallWithSpaceStyles,
    !noMargin && !small && largeWithSpaceStyles,
    enabled
      ? active
        ? primary
          ? activePrimaryStyles(colors)
          : activeSecondaryStyles
        : primary
          ? primaryStyles(colors)
          : secondaryStyles
      : disabledStyles,
    warning && enabled && warningStyles,
    (Array.isArray(children)
      ? children.some((child) => child && typeof child === 'object')
      : children && typeof children === 'object') ||
      (small ? null : largeTextOnlyStyles),
    (Array.isArray(children)
      ? children.some((child) => typeof child === 'string')
      : typeof children === 'string') ||
      (small ? smallIconOnlyStyles : largeIconOnlyStyles),
    fullWidth && fullWidthStyles,
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
