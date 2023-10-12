import { ComponentProps, ReactNode } from 'react';
import { css } from '@emotion/react';

import { Link, Card, Paragraph, pixels } from '@asap-hub/react-components';

const { rem, tabletScreen, smallDesktopScreen } = pixels;
const containerStyles = css({
  display: 'grid',
  gridTemplateColumns: 'auto',
  alignItems: 'center',
  padding: rem(24),
  [`@media (min-width: ${smallDesktopScreen.min}px)`]: {
    gridTemplateColumns: 'auto max-content',
  },
  [`@media (min-width: ${tabletScreen.min}px) and (max-width: ${smallDesktopScreen.min}px)`]:
    {
      paddingBottom: rem(14),
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
  accent?: ComponentProps<typeof Card>['accent'];
};

const CtaCard: React.FC<CtaCardProps> = ({ href, buttonText, children }) => (
  <Card padding={false} accent="information">
    <div css={containerStyles}>
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
