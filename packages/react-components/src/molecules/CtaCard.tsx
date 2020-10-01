import React, { ReactNode } from 'react';
import css from '@emotion/css';

import { Link, Card, Paragraph } from '../atoms';
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
  paddingTop: `${12 / perRem}em`,
  paddingLeft: `${vminLinearCalcClamped(
    mobileScreen,
    24,
    tabletScreen,
    36,
    'px',
  )}`,
  paddingRight: `${vminLinearCalcClamped(
    mobileScreen,
    24,
    tabletScreen,
    36,
    'px',
  )}`,
  paddingBottom: `${vminLinearCalcClamped(
    mobileScreen,
    18,
    tabletScreen,
    24,
    'px',
  )}`,
  [`@media (min-width: ${smallDesktopScreen.min}px)`]: {
    gridTemplateColumns: 'auto max-content',
  },
});

const buttonStyles = css({
  display: 'flex',
  justifyContent: 'center',
  [`@media (min-width: ${tabletScreen.min}px)`]: {
    display: 'block',
  },
});

type CtaCardProps = {
  href: string;
  buttonText: string;
  children: ReactNode;
};

const CtaCard: React.FC<CtaCardProps> = ({ href, buttonText, children }) => (
  <Card padding={false} accent="green">
    <div css={getInTouchStyles}>
      <Paragraph>{children}</Paragraph>
      <div css={buttonStyles}>
        <Link buttonStyle small primary href={href}>
          {buttonText}
        </Link>
      </div>
    </div>
  </Card>
);

export default CtaCard;
