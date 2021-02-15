import React, { ReactNode } from 'react';
import css from '@emotion/css';

import {
  perRem,
  vminLinearCalcClamped,
  mobileScreen,
  tabletScreen,
  largeDesktopScreen,
  vminLinearCalc,
} from '../pixels';
import { Card, Divider } from '../atoms';
import { ember } from '../colors';
import { alertIcon } from '../icons';

const cardPadding = css({
  paddingTop: `${vminLinearCalcClamped(
    mobileScreen,
    18,
    tabletScreen,
    24,
    'px',
  )}`,
  paddingBottom: `${vminLinearCalcClamped(
    mobileScreen,
    18,
    tabletScreen,
    24,
    'px',
  )}`,
});

const contentPadding = css({
  paddingRight: `${vminLinearCalc(
    mobileScreen,
    24,
    largeDesktopScreen,
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

const toastStyles = css({
  display: 'flex',
  alignItems: 'center',
  paddingBottom: `${12 / perRem}em`,
  color: ember.rgb,
  fill: ember.rgb,
});

const iconStyles = css({
  display: 'inline-block',
  width: `${24 / perRem}em`,
  height: `${24 / perRem}em`,
  paddingRight: `${15 / perRem}em`,
});

interface ToastCardProps {
  readonly children: ReactNode;
  readonly toastText?: string;
}
const ToastCard: React.FC<ToastCardProps> = ({ children, toastText }) => (
  <Card padding={false}>
    <div css={[cardPadding, contentPadding]}>{children}</div>
    {toastText && (
      <>
        <Divider />
        <span css={[toastStyles, contentPadding]}>
          <span css={iconStyles}>{alertIcon}</span>
          {toastText}
        </span>
      </>
    )}
  </Card>
);

export default ToastCard;
