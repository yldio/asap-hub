import { css } from '@emotion/react';
import {
  largeDesktopScreen,
  mobileScreen,
  tabletScreen,
  vminLinearCalcClamped,
} from './pixels';

export const borderRadius = 9;

export const paddingStyles = css({
  paddingTop: `${vminLinearCalcClamped(
    mobileScreen,
    18,
    tabletScreen,
    24,
    'px',
  )}`,
  paddingRight: `${vminLinearCalcClamped(
    mobileScreen,
    24,
    largeDesktopScreen,
    36,
    'px',
  )}`,
  paddingBottom: `${vminLinearCalcClamped(
    mobileScreen,
    18,
    tabletScreen,
    24,
    'px',
  )}`,
  paddingLeft: `${vminLinearCalcClamped(
    mobileScreen,
    24,
    largeDesktopScreen,
    36,
    'px',
  )}`,
});
