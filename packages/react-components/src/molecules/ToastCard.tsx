import { Component, ReactNode } from 'react';
import { css } from '@emotion/react';

import { perRem, mobileScreen } from '../pixels';
import { Card } from '../atoms';
import { lead, silver, apricot, clay, info, sky } from '../colors';
import { AlertIcon, clockIcon, paperClipIcon } from '../icons';
import { paddingStyles } from '../card';

const toastStyles = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: `${15 / perRem}em ${24 / perRem}em`,

  [`@media (max-width: ${mobileScreen.max}px)`]: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
});

const iconStyles = css({
  display: 'inline-block',
  width: `${24 / perRem}em`,
  height: `${24 / perRem}em`,
  paddingRight: `${12 / perRem}em`,
});

const alertStyles = css({
  backgroundColor: apricot.rgb,
  color: clay.rgb,
  fill: clay.rgb,
});

const infoStyles = css({
  backgroundColor: sky.rgb,
  color: info.rgb,
  fill: info.rgb,
});

const leadStyles = css({
  backgroundColor: silver.rgb,
  color: lead.rgb,
  fill: lead.rgb,
});

const toastContentStyles = css({
  display: 'flex',
  alignItems: 'center',

  [`@media (max-width: ${mobileScreen.max}px)`]: {
    alignItems: 'flex-start',
  },
});

type Type = 'alert' | 'attachment' | 'live' | 'info';

const iconMap: Record<Type, ReactNode | Component> = {
  alert: <AlertIcon color={clay.rgb} />,
  attachment: paperClipIcon,
  live: clockIcon,
  info: <AlertIcon color={info.rgb} />,
};

const accentMap = {
  alert: alertStyles,
  info: infoStyles,
  attachment: leadStyles,
  live: leadStyles,
};

interface ToastCardProps {
  readonly children: ReactNode;
  readonly toastContent?: ReactNode;
  readonly toastAction?: ReactNode;
  readonly type?: Type;
}
const ToastCard: React.FC<ToastCardProps> = ({
  children,
  toastContent,
  toastAction,
  type = 'alert',
}) => (
  <Card padding={false}>
    {toastContent && (
      <>
        <span css={[toastStyles, accentMap[type]]}>
          <span css={toastContentStyles}>
            <span css={[iconStyles]}>{iconMap[type]}</span>
            {toastContent}
          </span>
          {toastAction}
        </span>
      </>
    )}
    <div className="children" css={[paddingStyles]}>
      {children}
    </div>
  </Card>
);

export default ToastCard;
