import React, { ReactNode } from 'react';
import css from '@emotion/css';

import { perRem } from '../pixels';
import { Card, Divider } from '../atoms';
import { ember } from '../colors';
import { alertIcon } from '../icons';
import { paddingStyles } from '../card';

const toastStyles = css({
  display: 'flex',
  alignItems: 'center',
  paddingTop: 0,
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
    <div css={[paddingStyles, toastText && { paddingBottom: 0 }]}>
      {children}
    </div>
    {toastText && (
      <>
        <Divider />
        <span css={[paddingStyles, toastStyles]}>
          <span css={iconStyles}>{alertIcon}</span>
          {toastText}
        </span>
      </>
    )}
  </Card>
);

export default ToastCard;
