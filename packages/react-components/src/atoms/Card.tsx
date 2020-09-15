import React from 'react';
import css from '@emotion/css';

import * as colors from '../colors';
import {
  perRem,
  vminLinearCalc,
  mobileScreen,
  largeDesktopScreen,
  tabletScreen,
  vminLinearCalcCapped,
} from '../pixels';
import { themes } from '../theme';

const containerStyles = css({
  paddingTop: `${vminLinearCalcCapped(
    mobileScreen,
    18,
    tabletScreen,
    24,
    'px',
    24,
  )}`,
  paddingRight: `${vminLinearCalc(
    mobileScreen,
    24,
    largeDesktopScreen,
    36,
    'px',
  )}`,
  paddingBottom: `${vminLinearCalcCapped(
    mobileScreen,
    30,
    tabletScreen,
    36,
    'px',
    36,
  )}`,
  paddingLeft: `${vminLinearCalc(
    mobileScreen,
    24,
    largeDesktopScreen,
    36,
    'px',
  )}`,

  borderRadius: `${10 / perRem}em`,
  border: `1px solid ${colors.silver.rgb}`,
});

interface CardProps {
  readonly children: React.ReactNode;
}
const Card: React.FC<CardProps> = ({ children }) => (
  <section css={[themes.light, containerStyles]}>{children}</section>
);

export default Card;
