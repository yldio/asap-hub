import { Component, ReactNode } from 'react';
import { css } from '@emotion/react';

import { rem, mobileScreen } from '../pixels';
import { Card } from '../atoms';
import { lead, silver, apricot, clay, info500, info100 } from '../colors';
import { WarningIcon, clockIcon, paperClipIcon, errorIcon } from '../icons';
import { borderRadius, paddingStyles } from '../card';

const toastStyles = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: `${rem(15)} ${rem(24)}`,

  [`@media (max-width: ${mobileScreen.max}px)`]: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
});

const iconStyles = css({
  display: 'inline-block',
  width: rem(24),
  height: rem(24),
  paddingRight: rem(12),
});

const alertStyles = css({
  backgroundColor: apricot.rgb,
  color: clay.rgb,
  fill: clay.rgb,
});

const infoStyles = css({
  backgroundColor: info100.rgb,
  color: info500.rgb,
  fill: info500.rgb,
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
  info: <WarningIcon color={info500.rgb} />,
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
