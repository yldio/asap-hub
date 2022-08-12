import { Component, ReactNode } from 'react';
import { css } from '@emotion/react';

import { perRem, mobileScreen } from '../pixels';
import { Card } from '../atoms';
import {
  lead,
  silver,
  apricot,
  clay,
  informationInfo500,
  semanticInformationInfo100,
} from '../colors';
import { AlertIcon, clockIcon, paperClipIcon, errorIcon } from '../icons';
import { borderRadius, paddingStyles } from '../card';

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
  backgroundColor: semanticInformationInfo100.rgb,
  color: informationInfo500.rgb,
  fill: informationInfo500.rgb,
  borderRadius: `${borderRadius - 1}px ${borderRadius - 1}px 0px 0px`,
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
  alert: errorIcon,
  attachment: paperClipIcon,
  live: clockIcon,
  info: <AlertIcon color={informationInfo500.rgb} />,
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
