import { ReactNode } from 'react';
import { css } from '@emotion/react';

import { Card, Paragraph } from '../atoms';
import { smallDesktopScreen, rem } from '../pixels';
import CtaContactSection from './CtaContactSection';

const getInTouchStyles = css({
  display: 'grid',
  gridTemplateColumns: 'auto',
  alignItems: 'center',
  gap: rem(24),
  padding: `${rem(32)} ${rem(24)}`,
  [`@media (min-width: ${smallDesktopScreen.min}px)`]: {
    gridTemplateColumns: 'auto max-content',
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
      <Paragraph noMargin>{children}</Paragraph>
      <CtaContactSection
        href={href}
        displayCopy={displayCopy}
        buttonText={buttonText}
      />
    </div>
  </Card>
);

export default CtaCard;
