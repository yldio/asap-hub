import { css } from '@emotion/react';

import { rem, smallDesktopScreen } from '../pixels';
import { Card } from '../atoms';
import { contentSidePaddingWithNavigation } from '../layout';

const cardStyles = css({ marginBottom: rem(32) });

const containerStyles = css({
  padding: rem(24),
  display: 'grid',
  [`@media (max-width: calc(${
    smallDesktopScreen.width
  }px + ${contentSidePaddingWithNavigation(4)}))`]: {
    gridTemplateColumns: '1fr',
  },
  gridTemplateColumns: '1fr 1fr',
  rowGap: rem(16),
  columnGap: rem(16),
});

interface CaptionCardProps {
  children: React.ReactNode;
}
const CaptionCard: React.FC<CaptionCardProps> = ({ children }) => (
  <Card padding={false} overrideStyles={cardStyles}>
    <div css={containerStyles}>{children}</div>
  </Card>
);
export default CaptionCard;
