import React from 'react';
import css from '@emotion/css';

import * as colors from '../colors';
import {
  perRem,
  vminLinearCalc,
  mobileScreen,
  largeDesktopScreen,
  tabletScreen,
  vminLinearCalcClamped,
} from '../pixels';
import { themes } from '../theme';

const containerStyles = css({
  borderRadius: `${10 / perRem}em`,
  border: `1px solid ${colors.silver.rgb}`,
});

const normalPadding = css({
  paddingTop: `${vminLinearCalcClamped(
    mobileScreen,
    18,
    tabletScreen,
    24,
    'px',
  )}`,
  paddingRight: `${vminLinearCalc(
    mobileScreen,
    24,
    largeDesktopScreen,
    36,
    'px',
  )}`,
  paddingBottom: `${vminLinearCalcClamped(
    mobileScreen,
    30,
    tabletScreen,
    36,
    'px',
  )}`,
  paddingLeft: `${vminLinearCalc(
    mobileScreen,
    24,
    largeDesktopScreen,
    36,
    'px',
  )}`,
});

const minimalPadding = css({
  paddingTop: `${vminLinearCalcClamped(
    mobileScreen,
    18,
    tabletScreen,
    24,
    'px',
  )}`,
  paddingRight: `${vminLinearCalc(
    mobileScreen,
    24,
    largeDesktopScreen,
    36,
    'px',
  )}`,
  paddingBottom: `${vminLinearCalcClamped(
    mobileScreen,
    12,
    tabletScreen,
    24,
    'px',
  )}`,
  paddingLeft: `${vminLinearCalc(
    mobileScreen,
    24,
    largeDesktopScreen,
    36,
    'px',
  )}`,
});

interface CardProps {
  readonly minPadding?: boolean;
  readonly children: React.ReactNode;
}
const Card: React.FC<CardProps> = ({ children, minPadding }) => (
  <section
    css={[
      themes.light,
      containerStyles,
      minPadding ? minimalPadding : normalPadding,
    ]}
  >
    {children}
  </section>
);

export default Card;
