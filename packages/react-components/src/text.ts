import { isValidElement } from 'react';
import type { Interpolation } from '@emotion/css';

import {
  perRem,
  vminLinearCalc,
  mobileScreen,
  largeDesktopScreen,
  lineHeight,
} from './pixels';

export type TextChild = React.ReactText | boolean | null | undefined;
export type TextChildren = TextChild | ReadonlyArray<TextChild>;
export type AllowedElement = React.ReactElement<HTMLElement>;
export type AllowedChildren =
  | TextChildren
  | AllowedElement
  | ReadonlyArray<AllowedElement | AllowedChildren>;

const isTextChild = (child: unknown): child is TextChild =>
  child === null ||
  ['string', 'number', 'boolean', 'undefined'].includes(typeof child);

export const isTextChildren = (children: unknown): children is TextChildren => {
  if (isTextChild(children)) return true;
  if (Array.isArray(children))
    return children.every((child) => isTextChildren(child));
  return false;
};

export function assertIsTextChildren(
  children: unknown,
): asserts children is TextChildren {
  if (!isTextChildren(children)) {
    throw new Error(`Expected text children, got ${String(children)}`);
  }
}

const isAllowedElement = (child: unknown): child is AllowedElement => {
  if (
    typeof child === 'object' &&
    isValidElement(child) &&
    typeof child.type === 'string' &&
    ['i', 'em'].includes(child.type.toLowerCase())
  )
    return true;
  return false;
};

export const isAllowedChildren = (
  children: unknown,
): children is AllowedChildren => {
  if (isTextChild(children)) return true;

  if (isAllowedElement(children)) {
    if (children.props.children) {
      return isAllowedChildren(children.props.children);
    }
    return true;
  }

  if (Array.isArray(children))
    return children.every(
      (child) => isAllowedChildren(child) || isAllowedElement(child),
    );
  return false;
};

export const fontStyles = {
  fontFamily:
    "Calibri, Mukta, Candara, Segoe, 'Segoe UI', Optima, Arial, sans-serif",
  WebkitFontSmoothing: 'antialiased',
  MozOsxFontSmoothing: 'auto',

  fontSize: `${perRem}px`,
  lineHeight: `${lineHeight / perRem}em`,
} as const;
export const captionStyles = {
  fontSize: `${13.6 / perRem}em`,
};
export const layoutStyles = {
  marginTop: '12px',
  marginBottom: '12px',

  ':empty': {
    display: 'none',
  },
} as const;
export const headlineStyles = {
  1: {
    fontWeight: 'bold',
    fontSize: vminLinearCalc(
      mobileScreen,
      35.25,
      largeDesktopScreen,
      41.5,
      'px',
    ),
    lineHeight: vminLinearCalc(mobileScreen, 42, largeDesktopScreen, 48, 'px'),
  } as Interpolation,
  2: {
    fontWeight: 'bold',
    fontSize: vminLinearCalc(
      mobileScreen,
      29.38,
      largeDesktopScreen,
      33.2,
      'px',
    ),
    lineHeight: vminLinearCalc(mobileScreen, 30, largeDesktopScreen, 42, 'px'),
  } as Interpolation,
  3: {
    fontWeight: 'bold',
    fontSize: vminLinearCalc(
      mobileScreen,
      24.48,
      largeDesktopScreen,
      26.56,
      'px',
    ),
    lineHeight: vminLinearCalc(mobileScreen, 30, largeDesktopScreen, 36, 'px'),
  } as Interpolation,
  4: {
    fontWeight: 'bold',
    fontSize: vminLinearCalc(
      mobileScreen,
      20.4,
      largeDesktopScreen,
      21.25,
      'px',
    ),
    lineHeight: vminLinearCalc(mobileScreen, 24, largeDesktopScreen, 30, 'px'),
  } as Interpolation,
  5: {
    ...fontStyles,
    fontWeight: 'bold',
  } as Interpolation,
  6: {
    ...fontStyles,
    fontWeight: 'normal',
  },
} as const;

export type AccentColorName =
  | 'lead'
  | 'charcoal'
  | 'ember'
  | 'pepper'
  | 'sandstone'
  | 'clay'
  | 'pine'
  | 'fern'
  | 'cerulean'
  | 'denim'
  | 'prussian'
  | 'space'
  | 'berry'
  | 'magenta'
  | 'iris'
  | 'mauve';
