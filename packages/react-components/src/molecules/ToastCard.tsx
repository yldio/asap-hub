import React, { ReactNode } from 'react';
import css from '@emotion/css';

import { perRem } from '../pixels';
import { Card, Divider } from '../atoms';
import { ember, lead } from '../colors';
import { alertIcon, clockIcon, paperClipIcon } from '../icons';
import { paddingStyles } from '../card';

const toastStyles = css({
  display: 'flex',
  alignItems: 'flex-start',
  paddingTop: 0,
  paddingBottom: `${12 / perRem}em`,
});

const iconStyles = css({
  display: 'inline-block',
  width: `${24 / perRem}em`,
  height: `${24 / perRem}em`,
  paddingRight: `${15 / perRem}em`,
});

const emberStyles = css({
  color: ember.rgb,
  fill: ember.rgb,
});

const leadStyles = css({
  color: lead.rgb,
  fill: lead.rgb,
});

type Type = 'alert' | 'attachment' | 'live';

const iconMap: Record<Type, ReactNode> = {
  alert: alertIcon,
  attachment: paperClipIcon,
  live: clockIcon,
};

const accentMap = {
  alert: emberStyles,
  attachment: leadStyles,
  live: leadStyles,
};

interface ToastCardProps {
  readonly children: ReactNode;
  readonly toastContent?: ReactNode;
  readonly type?: Type;
}
const ToastCard: React.FC<ToastCardProps> = ({
  children,
  toastContent,
  type = 'alert',
}) => (
  <Card padding={false}>
    <div css={[paddingStyles, toastContent && { paddingBottom: 0 }]}>
      {children}
    </div>
    {toastContent && (
      <>
        <Divider />
        <span css={[paddingStyles, toastStyles, accentMap[type]]}>
          <span css={iconStyles}>{iconMap[type]}</span>
          {toastContent}
        </span>
      </>
    )}
  </Card>
);

export default ToastCard;
