import React from 'react';
import css from '@emotion/css';

import * as colors from '../colors';
import {
  perRem,
  vminLinearCalc,
  mobileScreen,
  largeDesktopScreen,
} from '../pixels';

const containerStyles = css({
  backgroundColor: colors.paper.rgb,
  borderRadius: `${10 / perRem}em`,
  border: `1px solid ${colors.silver.rgb}`,
  padding: vminLinearCalc(mobileScreen, 24, largeDesktopScreen, 36, 'px'),
});

interface CardProps {
  readonly children: React.ReactNode;
}
const Card: React.FC<CardProps> = ({ children }) => (
  <section css={[containerStyles]}>{children}</section>
);

export default Card;
