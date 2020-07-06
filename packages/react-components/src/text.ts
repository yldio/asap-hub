import type { Interpolation } from '@emotion/css';
import { charcoal, paper } from './colors';
import {
  perRem,
  vminLinearCalc,
  mobileScreen,
  largeDesktopScreen,
} from './pixels';

type TextChild = React.ReactText | boolean | null | undefined;
export type TextChildren = TextChild | ReadonlyArray<TextChild>;

export const fontStyles = {
  fontFamily: "Calibri, Candara, Segoe, 'Segoe UI', Optima, Arial, sans-serif",
  fontSize: `${perRem}px`,
  lineHeight: `${24 / 17}em`,

  backgroundColor: paper.rgb,
  color: charcoal.rgb,
} as const;
export const layoutStyles = {
  margin: 0,

  paddingTop: '12px',
  paddingBottom: '12px',

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
} as const;

export type AccentColorName =
  | 'lead'
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
