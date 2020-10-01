import React from 'react';
import css from '@emotion/css';

import { Link, Card } from '../atoms';
import {
  mobileScreen,
  perRem,
  vminLinearCalcClamped,
  tabletScreen,
  smallDesktopScreen,
} from '../pixels';

const getInTouchStyles = css({
  display: 'grid',
  gridTemplateColumns: 'auto',
  alignItems: 'center',
  padding: `${12 / perRem}em ${vminLinearCalcClamped(
    mobileScreen,
    24,
    tabletScreen,
    36,
    'px',
  )}`,
  [`@media (min-width: ${smallDesktopScreen.min}px)`]: {
    gridTemplateColumns: 'auto min-content',
  },
});

const buttonStyles = css({
  flexGrow: 1,
  display: 'flex',
  justifyContent: 'center',
  [`@media (min-width: ${tabletScreen.min}px)`]: {
    display: 'block',
  },
});

type CtaCardProps = {
  href: string;
  buttonText: string;
};

const CtaCard: React.FC<CtaCardProps> = ({ href, buttonText, children }) => (
  <Card padding={false} accent="green">
    <div css={getInTouchStyles}>
      <div>{children}</div>
      <div css={buttonStyles}>
        <Link buttonStyle small primary href={href}>
          {buttonText}
        </Link>
      </div>
    </div>
  </Card>
);

export default CtaCard;
