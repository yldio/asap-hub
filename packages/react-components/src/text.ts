import { isValidElement } from 'react';
import { CSSObject } from '@emotion/react';

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

export const getHTMLElements = (node: React.ReactNode) => {
  let tags: string[] = [];
  const htmlElements: string[] = [];

  const getTags = (node: React.ReactNode) =>
    Array.isArray(node) &&
    node?.forEach((child) => {
      if (child.type) {
        tags.push(child.type);
      } else {
        let html = '';

        if (tags.length) {
          tags.forEach((tag, index) => {
            if (index === 0) {
              html = `<${tag} style=color:inherit>${String(child)}</${tag}>`;
            } else {
              html = `<${tag} style=color:inherit>${html}</${tag}>`;
            }
          });
        } else {
          html = String(child);
        }

        htmlElements.push(html);
        tags = [];
      }
      if (child?.props?.children) {
        getTags(child.props.children);
      }
    });

  getTags(node);
  return htmlElements;
};

export const fontStyles = {
  fontFamily:
    "Roboto, 'Roboto Slab', Calibri, Mukta, Candara, Segoe, 'Segoe UI', Optima, Arial, sans-serif",
  WebkitFontSmoothing: 'antialiased',
  MozOsxFontSmoothing: 'auto',

  fontSize: `${perRem}px`,
  lineHeight: `${lineHeight / perRem}em`,
} as const;
export const captionStyles = {
  fontSize: `${14 / perRem}em`,
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
    fontFamily: 'Roboto Slab',
    fontSize: vminLinearCalc(
      mobileScreen,
      35.25,
      largeDesktopScreen,
      41.5,
      'px',
    ),
    lineHeight: vminLinearCalc(mobileScreen, 42, largeDesktopScreen, 48, 'px'),
  } as CSSObject,
  2: {
    fontWeight: 'bold',
    fontFamily: 'Roboto Slab',
    fontSize: vminLinearCalc(mobileScreen, 30, largeDesktopScreen, 30, 'px'),
    lineHeight: vminLinearCalc(mobileScreen, 30, largeDesktopScreen, 42, 'px'),
  } as CSSObject,
  3: {
    fontWeight: 'bold',
    fontFamily: 'Roboto Slab',
    fontSize: vminLinearCalc(
      mobileScreen,
      24.48,
      largeDesktopScreen,
      26.56,
      'px',
    ),
    lineHeight: vminLinearCalc(mobileScreen, 30, largeDesktopScreen, 36, 'px'),
  } as CSSObject,
  4: {
    fontWeight: 'bold',
    fontFamily: 'Roboto Slab',
    fontSize: vminLinearCalc(
      mobileScreen,
      20.4,
      largeDesktopScreen,
      21.25,
      'px',
    ),
    lineHeight: vminLinearCalc(mobileScreen, 24, largeDesktopScreen, 30, 'px'),
  } as CSSObject,
  5: {
    ...fontStyles,
    fontFamily: 'Roboto Slab',
    fontWeight: 'bold',
  } as CSSObject,
  6: {
    ...fontStyles,
    fontWeight: 'normal',
  } as CSSObject,
} as const;

export type AccentColorName =
  | 'lead'
  | 'charcoal'
  | 'ember'
  | 'pepper'
  | 'sandstone'
  | 'clay'
  | 'pine'
  | 'mint'
  | 'fern'
  | 'cerulean'
  | 'denim'
  | 'prussian'
  | 'space'
  | 'berry'
  | 'magenta'
  | 'iris'
  | 'mauve';
