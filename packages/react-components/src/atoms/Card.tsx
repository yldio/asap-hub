import React from 'react';
import css from '@emotion/css';

import * as colors from '../colors';
import {
  perRem,
  vminLinearCalc,
  mobileScreen,
  largeDesktopScreen,
} from '../pixels';
import { themes } from '../theme';

const containerStyles = css({
  padding: `24px ${vminLinearCalc(
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
