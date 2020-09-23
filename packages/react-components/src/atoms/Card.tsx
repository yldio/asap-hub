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

export type AccentVariant = 'default' | 'red' | 'green';

export const accents: Record<AccentVariant, string> = {
  default: `border-color: ${colors.silver.rgb};`,
  red: `background-color: ${colors.rose.rgb}; color: ${colors.ember.rgb};  border-color: ${colors.ember.rgb};`,
  green: `background-color: ${colors.mint.rgb}; color: ${colors.pine.rgb};  border-color: ${colors.pine.rgb};`,
};

const containerStyles = css({
  borderRadius: `${10 / perRem}em`,
  borderStyle: 'solid',
  borderWidth: 1,
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
  readonly accent?: AccentVariant;
  readonly children: React.ReactNode;
}
const Card: React.FC<CardProps> = ({
  children,
  minPadding,
  accent = 'default',
}) => (
  <section
    css={[
      themes.light,
      containerStyles,
      accents[accent],
      minPadding ? minimalPadding : normalPadding,
    ]}
  >
    {children}
  </section>
);

export default Card;
