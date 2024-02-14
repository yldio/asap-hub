import { ReactNode } from 'react';
import { css } from '@emotion/react';

import { Card, Paragraph } from '../atoms';
import {
  mobileScreen,
  perRem,
  vminLinearCalcClamped,
  tabletScreen,
  smallDesktopScreen,
} from '../pixels';
import CtaContactSection from './CtaContactSection';

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
    gridTemplateColumns: 'auto max-content',
  },
  [`@media (min-width: ${tabletScreen.min}px) and (max-width: ${smallDesktopScreen.min}px)`]:
    {
      paddingBottom: `${14 / perRem}em`,
    },
});

type CtaCardProps = {
  href: string;
  buttonText: string;
  children: ReactNode;
  displayCopy?: boolean;
};

const CtaCard: React.FC<CtaCardProps> = ({
  href,
  buttonText,
  children,
  displayCopy = false,
}) => (
  <Card padding={false} accent="green">
    <div css={getInTouchStyles}>
      <Paragraph>{children}</Paragraph>
      <CtaContactSection
        href={href}
        displayCopy={displayCopy}
        buttonText={buttonText}
      />
    </div>
  </Card>
);

export default CtaCard;
